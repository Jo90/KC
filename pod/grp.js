/** //pod/grp.js
 *
 */
YUI.add('j-pod-grp',function(Y){

    Y.namespace('J.pod').grp=function(cfg){

        if(typeof cfg==='undefined'
        ){cfg={};}

        cfg=Y.merge({
            title      :'team'
           ,visible    :false
           ,width      :1000
           ,xy         :[10,20]
           ,zIndex     :999
        },cfg);

        this.info={
            id         :'grpEdit'
           ,title      :cfg.title
           ,description:'edit team/group details'
           ,version    :'v1.0 August 2012'
        };

        var self=this
           ,d={
                TG_COLLECTION_TEAM_SOCIAL  :1
               ,TG_COLLECTION_TEAM_BUSINESS:2
               ,data:{
                    grpInfo:[]
                }
               ,list:{
                    grpInfoCategories:['Vision','Purpose','Strategy','Scope','Location','Mission','Meetings','History','Plan']
                }
               ,pod:{}
               ,tag:{
                    business:[]
                   ,social:[]
                }
            }
           ,h={}
            //functions
           ,initialise
           ,io={}
           ,listeners
           ,pod={}
           ,populate={}
           ,render={}
           ,sync={}
           ,trigger={}
        ;

        this.display=function(p){
            d.pod=Y.merge(d.pod,p);
            Y.J.widget.dialogMask.mask(h.ol.get('zIndex'));
            h.ol.show();
debugger;
            J.db.grp.fetch();
        };

        this.get=function(what){
            if(what==='zIndex'){return h.ol.get('zIndex');}
        };
        this.set=function(what,value){
            if(what==='zIndex'){h.ol.set('zIndex',value);}
            if(what==='cfg'   ){cfg=Y.merge(cfg,value);}
        };

        this.my={}; //children

        /**
         * private
         */

        initialise=function(){
            h.bb.addClass('j-pod-'+self.info.id);
            new Y.DD.Drag({node:h.bb,handles:[h.hd,h.ft]});
            sync.all();
        };

        io={
            insert:{
                grp:function(){
                    var newGroupName=prompt('New group name'),
                        post
                    ;
                    if(newGroupName===null||newGroupName===''){return;}
                    post=[{
                        action:'admin',
                        data:{
                            name         :newGroupName,
                            contactDetail:h.bd.one('>.j-record-grp .j-data-contactDetail').get('value'),
                            usr          :J.user.usr.id
                        }
                    }];
                    J.db.grp('i',post);
                }
            }
           ,update:{
                grp:function(){
                    var post=[]
                    ;
                    h.bd.all('>.j-record-grp').each(function(grpNode){
                        var grpData  =grpNode.getData('data')
                           ,grpHandle=grpNode.getData('handle')
                           ,grp={
                                data:{
                                    name         :grpNode.one('.j-data-name'         ).get('value')
                                   ,contactDetail:grpNode.one('.j-data-contactDetail').get('value')
                                }
                               ,remove:grpNode.one('.j-remove').get('checked')
                               ,children:{
                                    grpInfo:[]
                                   ,tgLink:[{data:{
                                        dbTable   :J.data.dbTable.grp.id
                                       ,collection:d.TG_COLLECTION_TEAM_SOCIAL
                                       ,tagIds    :grpHandle.socialTags.get('selected')
                                    }},{data:{
                                        dbTable   :J.data.dbTable.grp.id
                                       ,collection:d.TG_COLLECTION_TEAM_BUSINESS
                                       ,tagIds    :grpHandle.businessTags.get('selected')
                                    }}]
                                }
                            }
                        ;
                        if(typeof grpData!=='undefined'){grp.data.id=grpData.id}
                        //group info
                            grpHandle.tvGrp.all('.j-grpInfo-list > .j-record').each(function(grpInfoListNode,idx){
                                var originalData      =grpInfoListNode.getData('data')
                                   ,grpInfoContentNode=grpInfoListNode.getData('relatedNode')
                                   ,post={
                                       data:{
                                            displayOrder:idx
                                           ,viewable    :parseInt(grpInfoContentNode.one('.j-data-viewable').get('value'),10)
                                           ,category    :grpInfoListNode.one('.j-data-category').get('value')
                                           ,info        :grpInfoContentNode.one('.j-data-info').get('innerHTML')
                                        }
                                       ,remove:grpInfoContentNode.one('.j-remove').get('checked')
                                    }
                                ;
                                if(typeof originalData!=='undefined'){post.data.id=originalData.id;}
                                grp.children.grpInfo.push(post);
                            });
                        post.push({criteria:{grp:[grp]}});
                    });
                    J.db.grp('u',post);
                }
               ,grpUsr:function(e){
return; //>>>>FINISH
                    var rec=h.grid.grpUsrDataTable.getRecord(e.currentTarget.get('id')).toJSON()
                    ;
                    Y.io('/db/grpUsr/u.php',{
                        method:'POST'
                       ,on:{complete:J.db.grp}
                       ,data:Y.JSON.stringify([{data:{
                            grp         :rec.grp
                           ,usr         :rec.usr
                           ,member      :Math.round((new Date()).getTime()/1000)
                           ,admin       :null
                           ,joinRequest :rec.joinRequest
                           ,joinReason  :rec.joinReason
                           ,id          :rec.id
                       }}])
                    });
                }
            }
        };

        listeners=function(){
            h.addGrp.on('click',io.insert.grp);
            h.close.on('click',trigger.close);
            h.bd.delegate('change',function(){
                this.ancestor('.j-record-grp').all('>div').setStyle('display',this.get('checked')?'none':'');
            },'.j-record-grp > legend .j-remove');
            h.bd.delegate('click',function(){this.ancestor('.j-record').remove();},'a.j-remove-grp');
            h.ft.one('.j-save').on('click',function(){io.update.grp();io.update.grpUsr();});
            //custom
                Y.on('j-db-info:s',populate.grp);
                Y.on('j-db-grp:s' ,populate.grp);
                Y.on('j-db-grp:i' ,sync.grp.insert);
        };

        pod={
            display:{
                editor:function(e){
                    h.podInvoke=this;
                    if(!self.my.podEditor){pod.load.editor();return false;}
                    self.my.podEditor.display(e);
                }
               ,grpNew:function(e){
                    h.podInvoke=this;
                    if(!self.my.podGrpNew){pod.load.grpNew();return false;}
                    self.my.podGrpNew.display(e);
                }
               ,info:function(e){
                    h.podInvoke=this;
                    if(!self.my.podInfo){pod.load.info();return false;}
                    if(this.hasClass('j-no-info')){
                        self.my.podInfo.display({
                            dbTable:J.data.dbTable.grp.id
                           ,pk     :this.ancestor('.j-record-grp').getData('data')
                        });
                    }else{
                        self.my.podInfo.display(
                            this.ancestor('.j-record-grp').getData('handle').grpInfoDataTable.getRecord(e.currentTarget.get('id')).toJSON()
                        );
                    }
                }
               ,report:function(e){
                    var body='test FINISH'
                    ;
                    //sentry
                        if(e.target.get('tagName')==='BUTTON'){return;}
                    h.podInvoke=e.currentTarget;
                    if(!self.my.podReport){
                        pod.load.report({});
                        return false;
                    }
                    self.my.podReport.display({
                        html   :'<html><head><title>Users name</title></head><body>'+body+'</body></html>'
                       ,subject:'report'
                       ,sendTo :'joe@dargaville.net'
                       ,title  :'test'
                    });
                }
            }
           ,load:{
                editor:function(){
                    Y.use('j-pod-editor',function(Y){
                        self.my.podEditor=new Y.J.pod.editor({});
                        Y.J.whenAvailable.inDOM(self,'my.podEditor',function(){
                            self.my.podEditor.set('zIndex',cfg.zIndex+10);
                            h.podInvoke.simulate('click');
                        });
                        Y.on(self.my.podEditor.customEvent.save,function(rs){h.podInvoke.setContent(rs);});
                    });
                }
               ,grpNew:function(){
                    Y.use('j-pod-grpNew',function(Y){
                        self.my.podGrpNew=new Y.J.pod.info({});
                        Y.J.whenAvailable.inDOM(self,'my.podGrpNew',function(){
                            self.my.podGrpNew.set('zIndex',cfg.zIndex+10);
                            h.podInvoke.simulate('click');
                        });
                        Y.on(self.my.podGrpNew.customEvent.save,function(rs){h.podInvoke.setContent(rs);});
                    });
                }
               ,info:function(){
                    Y.use('j-pod-info',function(Y){
                        self.my.podInfo=new Y.J.pod.info({});
                        Y.J.whenAvailable.inDOM(self,'my.podInfo',function(){
                            self.my.podInfo.set('zIndex',cfg.zIndex+10);
                            self.my.podInfo.set('cfg',{
                                addUserDefinedCategory:true
                               ,predefinedCategories  :d.list.grpInfoCategories
                            });
                            h.podInvoke.simulate('click');
                        });
                        Y.on(self.my.podInfo.customEvent.save,function(rs){h.podInvoke.setContent(rs);});
                    });
                }
               ,report:function(){
                    Y.use('j-pod-report',function(Y){
                        self.my.podReport=new Y.J.pod.report({'zIndex':99999});
                        Y.J.whenAvailable.inDOM(self,'my.podReport',function(){h.podInvoke.simulate('click');});
                    });
                }
            }
        };

        populate={
            grp:function(rs){
                var btnRemove
                   ,grpInfoCategories=[]
                   ,grpInfoExistingCategories=[]
                   ,recs={
                        grpInfo:[]
                       ,grpUsr :[]
                    }
                   ,handle={}
                   ,list={}
                   ,nn={}
                   ,optGroup
                   ,tv={}
                   ,grpInfoNav,grpInfoList
                ;
                J.rs=Y.merge(J.rs,rs[0].result);
                h.bd.setContent('');
                Y.each(J.rs.grp.data,function(grp){ //only 1 grp passed at this time

                    if(Y.Array.indexOf(d.pod.grpIds,grp.id)===-1){return;}

                    nn.grp=render.grp();
                    //local shortcuts
                        tv.base  =nn.grp.getData('tv');
                        tv.info  =tv.base.item(0).get('panelNode');
                        tv.grpUsr=tv.base.item(1).get('panelNode');
                        tv.events=tv.base.item(2).get('panelNode');
                        handle.tvGrp   =tv.info;
                        handle.tvGrpUsr=tv.grpUsr;
                        handle.tvEvents=tv.events;

                    Y.J.removeOption(nn.grp.one('legend'));
                    nn.grp.one('.j-association').remove();

                    //enable/disable if member/admin
                        nn.grp.all('.j-enable').set('disabled',true);
                        h.addGrp.hide();
                        Y.each(J.rs.grpUsr.data,function(grpUsr){
                            if(grpUsr.usr!==J.user.usr.id){return;}
                            nn.grp.all('.j-enable-member').set('disabled',false);
                            if(grpUsr.admin!==null){
                                nn.grp.all('.j-enable-admin').set('disabled',false);
                                h.addGrp.show();
                            }
                        });
                    //group
                        nn.grp.one('.j-data-name'         ).set('value',grp.name);
                        nn.grp.one('.j-data-created'      ).setContent('created:'+Y.DataType.Date.format(new Date(grp.created*1000),{format:'%d %B %G'}));
                        nn.grp.one('.j-data-contactDetail').set('value',grp.contactDetail);
                    //tags
                        list.social  =[];
                        list.business=[];
                        Y.each(J.rs.grpTags.data,function(grpTag){
                            if(grpTag.pk!==grp.id){return;}
                            if(grpTag.collection===d.TG_COLLECTION_TEAM_SOCIAL  ){list.social.push(grpTag.tag);}
                            if(grpTag.collection===d.TG_COLLECTION_TEAM_BUSINESS){list.business.push(grpTag.tag);}
                        });
                        handle.socialTags=new Y.J.widget.List({
                            elements:d.list.socialAll
                           ,selected:list.social
                           ,selectorPrompt:'+social tags'
                        }).render(nn.grp.one('.j-tags-social'));
                        handle.businessTags=new Y.J.widget.List({
                            elements:d.list.businessAll
                           ,selected:list.business
                           ,selectorPrompt:'+business tags'
                        }).render(nn.grp.one('.j-tags-business'));
                    //group info
                        sync.info(nn,tv,grp,handle);
                    //members
                        Y.each(J.rs.grpUsr.data,function(grpUsr){
                            grpUsr.grpId=grpUsr.id;
                            grpUsr.adminDate=grpUsr.admin===0
                                ?''
                                :Y.DataType.Date.format(new Date(grpUsr.admin*1000),{format:'%d %b %G'});
                            grpUsr.memberOption=grpUsr.member===null
                                ?'<button class="j-approve-pending" title="'
                                    +(Y.DataType.Date.format(new Date(grpUsr.joinRequest*1000),{format:'%d %b %G'}))
                                    +': '+grpUsr.joinReason+'">approve</button>'
                                :Y.DataType.Date.format(new Date(grpUsr.member*1000),{format:'%d %b %G'});
                            recs.grpUsr.push(Y.merge(grpUsr,J.rs.usr.data[grpUsr.usr]));
                        });
                        //grid
                            handle.grpUsrDataTable=new Y.DataTable({
                                columns:[
                                    {key:'firstName'                     ,sortable:true}
                                   ,{key:'lastName'                      ,sortable:true}
                                   ,{key:'knownAs'                       ,sortable:true}
                                   ,{key:'adminDate'   ,label:'admin'    ,sortable:true ,formatter:function(x){return x.value===1?'admin':'';}}
                                   ,{key:'memberOption',label:'member'   ,sortable:true ,allowHTML:true}
                                   ,{                   label:'interests'}
                                ]
                            ,data:recs.grpUsr
                            }).render(tv.grpUsr);
                            //listeners
                                handle.grpUsrDataTable.get('contentBox').delegate('click',function(e){
                                    //sentry
                                        if(e.target.hasClass('j-approve-pending')){return;}
                                    var rec=handle.grpUsrDataTable.getRecord(e.currentTarget.get('id')).toJSON()
                                    ;
                                    //>>>>FINISH display user
                                    debugger;
                                },'tr');
                                handle.grpUsrDataTable.get('contentBox').delegate('click',io.update.grpUsr,'.j-approve-pending');
                                handle.grpUsrDataTable.get('contentBox').delegate('click',pod.display.report,'tr');
                    //store
                        nn.grp.setData('data'  ,grp);
                        nn.grp.setData('handle',handle);
                });
            }
        };

        render={
            base:function(){
                h.ol=new Y.Overlay({
                    headerContent:
                        '<span title="pod:'+self.info.id+' '+self.info.version+' '+self.info.description+' &copy;JPS">'+self.info.title+'</span> '
                       +Y.J.html('btn',{action:'add',label:'add new group',title:'add information category'})
                       +Y.J.html('btn',{action:'close',title:'close pod'})
                   ,bodyContent:''
                   ,footerContent:Y.J.html('btn',{action:'save',title:'save' ,label:'save'})
                   ,visible:cfg.visible
                   ,width  :cfg.width
                   ,xy     :cfg.xy
                   ,zIndex :cfg.zIndex
                }).plug(Y.Plugin.Resize).render();
                //shortcuts
                    h.hd     =h.ol.headerNode;
                    h.bd     =h.ol.bodyNode;
                    h.ft     =h.ol.footerNode;
                    h.bb     =h.ol.get('boundingBox');
                    h.addGrp =h.hd.one('.j-add');
                    h.close  =h.hd.one('.j-close');
            }
           ,grp:function(){
                var nn=Y.Node.create(
                    '<fieldset class="j-record j-record-grp">'
                   +  '<legend>'
                   +    '<input type="text" class="j-data j-data-name j-enable j-enable-admin" placeholder="team/group name" title="team/group name" />'
                   +    '<span class="j-data j-data-created"></span> '
                   +    Y.J.html('btn',{action:'remove',label:'remove new group',classes:'j-remove-grp'})
                   +  '</legend>'
                   +  '<fieldset class="j-association">'
                   +    '<legend>association with parent group</legend>'
                   +    '<textarea></textarea>'
                   +  '</fieldset>'
                   +  'public contact details<br />'
                   +  '<textarea class="j-data j-data-contactDetail j-enable j-enable-admin" placeholder="contact details (public)"></textarea>'
                   +  '<div class="j-tags-social"></div>'
                   +  '<div class="j-tags-business"></div>'
                   +'</fieldset>'
                );
                h.bd.append(nn);
                nn.setData('tv',new Y.TabView({
                    children:[
                        {label:'about'  ,content:''}
                       ,{label:'members',content:''}
                       ,{label:'events' ,content:''}
                    ]
                }).render(nn));
                return nn;
            }
           ,grpUsr:function(p){
                var nn=Y.Node.create(
                        '<li class="record record-grpUsr">'
                       +  '<input type="hidden" class="data data-id" />'
                       +  '<input type="text" class="data data-nameFirst" placeholder="first name" title="first name" />'
                       +  '<input type="text" class="data data-nameLast"  placeholder="last name"  title="last name" />'
                       +  d.grpUsrInterest
                       +  Y.J.html('btn',{action:'find'  ,title:'find contact'})
                       +  Y.J.html('btn',{action:'remove',title:'remove record'})
                       +'</li>'
                    )
                ;
                p.node.append(nn);
                return nn;
            }
        };

        sync={
            all:function(){
                sync.tags();
            }
           ,grp:{
                insert:function(rs){
                    debugger;
                }
            }
           ,info:function(nn,tv,grp,handle){
                var data=[]
                ;
                if(typeof J.rs.grpInfo.data==='undefined' || J.rs.grpInfo.data.length===0){
                    nn.info=Y.Node.create(Y.J.html('btn',{action:'add',label:'add information category',classes:'j-no-info'}));
                    tv.info.append(nn.info);
                    nn.info.on('click',pod.display.info);
                }else{
                    Y.each(J.rs.grpInfo.data,function(grpInfo){
                        if(grpInfo.pk===grp.id){data.push(grpInfo);}
                    });
                    //grid
                        handle.grpInfoDataTable=new Y.DataTable({
                            columns:[
                                {key:'category'    ,sortable:true}
                               ,{key:'displayOrder',sortable:true,label:'seq'}
                               ,{key:'viewable'    ,sortable:true,label:'view',formatter:function(x){return x.value==='P'?'Public':'Group';}}
                               ,{key:'detail'      ,sortable:true,allowHTML:true}
                            ]
                           ,data:data
                        }).render(tv.info);
                        //listeners
                            handle.grpInfoDataTable.get('contentBox').delegate('click',pod.display.info,'tr');
                }
            }
           ,tags:function(){
                d.list.socialAll=[];
                d.list.businessAll=[];
                Y.each(J.data.tgCollectionTag,function(tgCollectionTag){
                    if(tgCollectionTag.collection===d.TG_COLLECTION_TEAM_SOCIAL){
                        d.list.socialAll.push({
                            id  :tgCollectionTag.tag
                           ,name:J.data.tgTag[tgCollectionTag.tag].name
                        });
                    }
                    if(tgCollectionTag.collection===d.TG_COLLECTION_TEAM_BUSINESS){
                        d.list.businessAll.push({
                            id  :tgCollectionTag.tag
                           ,name:J.data.tgTag[tgCollectionTag.tag].name
                        });
                    }
                });
            }
        };

        trigger={
            close:function(){
                h.ol.hide();
                Y.J.widget.dialogMask.hide();
            }
           ,grpInfoRecordFocus:function(e){
                var recNode=this.ancestor('.j-record')
                   ,contentNode=recNode.getData('relatedNode')
                ;
                recNode.get('parentNode').all('.j-record-focus').removeClass('j-record-focus');
                recNode.addClass('j-record-focus');
                contentNode.get('parentNode').all('>fieldset').setStyle('display','none');
                contentNode.setStyle('display','');
            }
           ,grpInfoSelectOption:function(e,idx){
                var idx=this.get('selectedIndex')
                   ,panel      =this.ancestor('.yui3-tab-panel')
                   ,list       =panel.one('.j-grpInfo-list')
                   ,content    =panel.one('.j-grpInfo-content')
                   ,grpNode    =this.ancestor('.j-record-grp')
                   ,grpData    =grpNode.getData('data')
                   ,grpHandle  =grpNode.getData('handle')
                   ,newCategory=''
                   ,nn
                   ,post
                ;
                if(idx===0){return;}
                if(idx===1){
                    newCategory=prompt('Enter your category');
                    if(newCategory===null){return;}
                }
                if(idx>1){newCategory=this.get('value');}
                //remove from select options if exists
                    if(Y.Array.indexOf(d.list.grpInfoCategories,newCategory)!==-1){
                        this.all('option').item(idx).remove();
                    }
                this.set('selectedIndex',0);
                nn=render.grpInfo({node:panel});
                nn.list.one('.j-data-category').set('value',newCategory);
                nn.content.one('legend em').setContent(newCategory);
                nn.list.one('input').simulate('click');
            }
        };

        /**
         *  load & initialise
         */
        Y.J.dataSet.fetch([
        ],function(){

            render.base();
            initialise();
            listeners();

        });
    };

},'1.0 August 2012',{requires:['base','io','node']});
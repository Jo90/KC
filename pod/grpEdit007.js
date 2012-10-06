/** /pod/grpEdit.js
 *
 *  Kauri Coast Promotion Society
 *
 */
YUI.add('kc-pod-grpEdit',function(Y){

    Y.namespace('KC.pod').grpEdit=function(cfg){

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
               ,rs:{}
            }
           ,h={
                grid:{}
               ,rec:{}
            }
            //functions
           ,initialise
           ,io={}
           ,listeners
           ,pod={}
           ,populate={}
           ,render={}
           ,trigger={}
        ;

        this.display=function(p){
            d.pod=Y.merge(d.pod,p);
            if(typeof h.mask==='undefined'){
                h.mask=Y.KC.widget.dialogMask.mask(h.ol.get('zIndex'));
                h.ol.show();
            }
            io.fetch.grp();
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
            h.bb.addClass('kc-pod-'+self.info.id);
            new Y.DD.Drag({node:h.bb,handles:[h.hd,h.ft]});
            //tag collections
                d.list.socialAll=[];
                d.list.businessAll=[];
                Y.each(KC.data.tgCollectionTag,function(tgCollectionTag){
                    if(tgCollectionTag.collection===d.TG_COLLECTION_TEAM_SOCIAL){
                        d.list.socialAll.push({
                            id  :tgCollectionTag.tag
                           ,name:KC.data.tgTag[tgCollectionTag.tag].name
                        });
                    }
                    if(tgCollectionTag.collection===d.TG_COLLECTION_TEAM_BUSINESS){
                        d.list.businessAll.push({
                            id  :tgCollectionTag.tag
                           ,name:KC.data.tgTag[tgCollectionTag.tag].name
                        });
                    }
                });
        };

        io={
            fetch:{
                grp:function(){
                    Y.io('/db/table/grp/s.php',{
                        method:'POST'
                       ,on:{complete:function(id,o){Y.fire('db-grp:available',Y.JSON.parse(o.responseText)[0].result);}}
                       ,data:Y.JSON.stringify([{criteria:{grpIds:[]}}])
                    });
                }
            }
           ,update:{
                grp:function(){
                    var post=[]
                    ;
                    h.bd.all('>.kc-record-grp').each(function(grpNode){
                        var grpData  =grpNode.getData('data')
                           ,grpHandle=grpNode.getData('handle')
                           ,grp={
                                data:{
                                    name         :grpNode.one('.kc-data-name'         ).get('value')
                                   ,contactDetail:grpNode.one('.kc-data-contactDetail').get('value')
                                }
                               ,remove:grpNode.one('.kc-remove').get('checked')
                               ,children:{
                                    grpInfo:[]
                                   ,tgLink:[{data:{
                                        dbTable   :KC.data.dbTable.grp.id
                                       ,collection:d.TG_COLLECTION_TEAM_SOCIAL
                                       ,tagIds    :grpHandle.socialTags.get('selected')
                                    }},{data:{
                                        dbTable   :KC.data.dbTable.grp.id
                                       ,collection:d.TG_COLLECTION_TEAM_BUSINESS
                                       ,tagIds    :grpHandle.businessTags.get('selected')
                                    }}]
                                }
                            }
                        ;
                        if(typeof grpData!=='undefined'){grp.data.id=grpData.id}
                        //group info
                            grpHandle.tvGrp.all('.kc-grpInfo-list > .kc-record').each(function(grpInfoListNode,idx){
                                var originalData      =grpInfoListNode.getData('data')
                                   ,grpInfoContentNode=grpInfoListNode.getData('relatedNode')
                                   ,post={
                                       data:{
                                            displayOrder:idx
                                           ,viewable    :parseInt(grpInfoContentNode.one('.kc-data-viewable').get('value'),10)
                                           ,category    :grpInfoListNode.one('.kc-data-category').get('value')
                                           ,info        :grpInfoContentNode.one('.kc-data-info').get('innerHTML')
                                        }
                                       ,remove:grpInfoContentNode.one('.kc-remove').get('checked')
                                    }
                                ;
                                if(typeof originalData!=='undefined'){post.data.id=originalData.id;}
                                grp.children.grpInfo.push(post);
                            });
                        post.push({criteria:{grp:[grp]}});
                    });
                    Y.io('/db/table/grp/u.php',{
                        method:'POST'
                       ,on:{complete:io.fetch.grp}
                       ,data:Y.JSON.stringify(post)
                    });
                }
               ,grpUsr:function(e){
return; //>>>>FINISH
                    var rec=h.grid.grpUsrDataTable.getRecord(e.currentTarget.get('id')).toJSON()
                    ;
                    Y.io('/db/table/grpUsr/u.php',{
                        method:'POST'
                       ,on:{complete:io.fetch.grp}
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
            h.add.on('click',render.grp);
            h.close.on('click',trigger.close);
            //group info
                h.bd.delegate('change',function(){
                    this.ancestor('.kc-record-grp').all('>div').setStyle('display',this.get('checked')?'none':'');
                },'.kc-record-grp > legend .kc-remove');
                h.bd.delegate('click',function(){this.ancestor('.kc-record').remove();},'a.kc-remove-grp');
            //group info
                h.bd.delegate('click',trigger.grpInfoRecordFocus,'.kc-grpInfo-list > li > em,.kc-grpInfo-list > li > input');
                h.bd.delegate('click',function(e){
                    var rec=this.ancestor('.kc-record');
                    rec.getData('relatedNode').remove();
                    rec.remove();
                },'.kc-remove-grpInfo');
                h.bd.delegate('change',trigger.grpInfoSelectOption,'.kc-grpInfo-options > select');
            h.bd.delegate('click',pod.display.editor,'.kc-editor');
            h.ft.one('.kc-save').on('click',function(){io.update.grp();io.update.grpUsr();});
            //custom
                Y.on('db-grp:available',populate.grp);
        };

        pod={
            display:{
                editor:function(e){
                    h.podInvoke=this;
                    if(!self.my.podEditor){pod.load.editor();return false;}
                    self.my.podEditor.display(e);
                }
               ,info:function(e){
                    h.podInvoke=this;
                    if(!self.my.podInfo){pod.load.info();return false;}
                    self.my.podInfo.display(e);
                }
               ,report:function(e){
                    var grp
                       ,body=''
                       ,head=''
                       ,tags=[]
                       ,users=[]
                       ,x
                    ;
                    //sentry
                        if(e.target.get('tagName')==='BUTTON'){return;}
                    h.podInvoke=e.currentTarget;
                    if(!self.my.podReport){
                        pod.load.report({});
                        return false;
                    }
                    var body='test';
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
                    Y.use('kc-pod-editor',function(Y){
                        self.my.podEditor=new Y.KC.pod.editor({});
                        Y.KC.whenAvailable.inDOM(self,'my.podEditor',function(){
                            self.my.podEditor.set('zIndex',cfg.zIndex+10);
                            h.podInvoke.simulate('click');
                        });
                        Y.on(self.my.podEditor.customEvent.save,function(rs){h.podInvoke.setContent(rs);});
                    });
                }
               ,info:function(){
                    Y.use('kc-pod-info',function(Y){
                        self.my.podInfo=new Y.KC.pod.info({});
                        Y.KC.whenAvailable.inDOM(self,'my.podInfo',function(){
                            self.my.podInfo.set('zIndex',cfg.zIndex+10);
                            h.podInvoke.simulate('click');
                        });
                        Y.on(self.my.podInfo.customEvent.save,function(rs){h.podInvoke.setContent(rs);});
                    });
                }
               ,report:function(){
                    Y.use('kc-pod-report',function(Y){
                        self.my.podReport=new Y.KC.pod.report({'zIndex':99999});
                        Y.KC.whenAvailable.inDOM(self,'my.podReport',function(){h.podInvoke.simulate('click');});
                    });
                }
            }
        };

        populate={
            grp:function(rs){
                var btnRemove
                   ,grpInfoCategories=[]
                   ,grpInfoExistingCategories=[]
                   ,grpUsrRecords=[]
                   ,handle={}
                   ,list={}
                   ,nn
                   ,optGroup
                   ,tv={}
                   ,grpInfoNav,grpInfoList
                ;
                d.rs=Y.merge(d.rs,rs);
                h.bd.setContent('');
                Y.each(d.rs.grp.data,function(grp){ //only 1 grp passed at this time

                    if(Y.Array.indexOf(d.pod.grpIds,grp.id)===-1){return;}

                    nn=render.grp();
                    //local shortcuts
                        tv.base  =nn.getData('tv');
                        tv.grp   =tv.base.item(0).get('panelNode');
                        tv.grpUsr=tv.base.item(1).get('panelNode');
                        tv.events=tv.base.item(2).get('panelNode');
                        handle.tvGrp   =tv.grp;
                        handle.tvGrpUsr=tv.grpUsr;
                        handle.tvEvents=tv.events;

                    Y.KC.removeOption(nn.one('legend'));
                    nn.one('.kc-association').remove();

                    //enable/disable if member/admin
                        nn.all('.kc-enable').set('disabled',true);
                        h.add.hide();
                        Y.each(d.rs.grpUsr.data,function(grpUsr){
                            if(grpUsr.usr!==KC.user.usr.id){return;}
                            nn.all('.kc-enable-member').set('disabled',false);
                            if(grpUsr.admin!==null){
                                nn.all('.kc-enable-admin').set('disabled',false);
                                h.add.show();
                            }
                        });
                    //group
                        nn.one('.kc-data-name'         ).set('value',grp.name);
                        nn.one('.kc-data-created'      ).setContent('created:'+Y.DataType.Date.format(new Date(grp.created*1000),{format:'%d %B %G'}));
                        nn.one('.kc-data-contactDetail').set('value',grp.contactDetail);
                    //tags
                        list.social  =[];
                        list.business=[];
                        Y.each(d.rs.grpTags.data,function(grpTag){
                            if(grpTag.pk!==grp.id){return;}
                            if(grpTag.collection===d.TG_COLLECTION_TEAM_SOCIAL  ){list.social.push(grpTag.tag);}
                            if(grpTag.collection===d.TG_COLLECTION_TEAM_BUSINESS){list.business.push(grpTag.tag);}
                        });
                        handle.socialTags=new Y.KC.widget.List({
                            elements:d.list.socialAll
                           ,selected:list.social
                           ,selectorPrompt:'+social tags'
                        }).render(nn.one('.kc-tags-social'));
                        handle.businessTags=new Y.KC.widget.List({
                            elements:d.list.businessAll
                           ,selected:list.business
                           ,selectorPrompt:'+business tags'
                        }).render(nn.one('.kc-tags-business'));
                    //group info
                        grpInfoCategories=tv.grp.one('.kc-grpInfo-options > select');
                        grpInfoList=tv.grp.one('.kc-grpInfo-list');
                        Y.each(d.rs.grpInfo.data,function(grpInfo,idx){
                            if(grpInfo.grp!==grp.id){return;}
                            var nns=render.grpInfo({node:tv.grp})
                            ;
                            Y.KC.removeOption(nns.content.one('legend'));
                            nns.list   .one('.kc-data-category').set('value',grpInfo.category);
                            nns.content.one('legend > em'      ).setContent(grpInfo.category);
                            nns.content.one('.kc-data-viewable').set('value',grpInfo.viewable);
                            nns.content.one('.kc-data-info'    ).setContent(grpInfo.info);
                            nns.list   .setData('data',grpInfo);
                            nns.content.setData('data',grpInfo);
                        });
                        //sortable
                            handle.grpInfoCategoriesList=new Y.Sortable({
                                container:grpInfoList
                               ,nodes    :'li'
                               ,opacity  :'.1'
                            });
                        //available categories
                            grpInfoExistingCategories=[];
                            Y.each(d.rs.grpInfo.data,function(grpInfo){
                                if(grpInfo.grp===grp.id){grpInfoExistingCategories.push(grpInfo.category);}
                            });
                            optGroup=Y.Node.create('<optgroup label="Predefined"></optgroup>');
                            grpInfoCategories.append(optGroup);
                            Y.each(d.list.grpInfoCategories,function(category){
                                if(Y.Array.indexOf(grpInfoExistingCategories,category)===-1){
                                    optGroup.append('<option>'+category+'</option>');
                                }
                            });
                        //default select
                            grpInfoList.one('input').simulate('click');
                    //members
                        Y.each(d.rs.grpUsr.data,function(grpUsr){
                            grpUsr.grpId=grpUsr.id;
                            grpUsr.adminDate=grpUsr.admin===0
                                ?''
                                :Y.DataType.Date.format(new Date(grpUsr.admin*1000),{format:'%d %b %G'});
                            grpUsr.memberOption=grpUsr.member===null
                                ?'<button class="kc-approve-pending" title="'
                                    +(Y.DataType.Date.format(new Date(grpUsr.joinRequest*1000),{format:'%d %b %G'}))
                                    +': '+grpUsr.joinReason+'">approve</button>'
                                :Y.DataType.Date.format(new Date(grpUsr.member*1000),{format:'%d %b %G'});
                            grpUsrRecords.push(Y.merge(grpUsr,d.rs.usr.data[grpUsr.usr]));
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
                            ,data:grpUsrRecords
                            }).render(tv.grpUsr);
                    //listeners
                        handle.grpUsrDataTable.get('contentBox').delegate('click',function(e){
                            //sentry
                                if(e.target.hasClass('kc-approve-pending')){return;}
                            var rec=handle.grpUsrDataTable.getRecord(e.currentTarget.get('id')).toJSON()
                            ;
                            //>>>>FINISH display user
                            debugger;
                        },'tr');
                        handle.grpUsrDataTable.get('contentBox').delegate('click',io.update.grpUsr,'.kc-approve-pending');
                        handle.grpUsrDataTable.get('contentBox').delegate('click',pod.display.report,'tr');
                    //store
                        nn.setData('data'  ,grp);
                        nn.setData('handle',handle);
                });
            }
        };

        render={
            base:function(){
                h.ol=new Y.Overlay({
                    headerContent:
                        '<span title="pod:'+self.info.id+' '+self.info.version+' '+self.info.description+' &copy;KCPS">'+self.info.title+'</span> '
                       +Y.KC.html('btn',{action:'add',label:'add category',title:'add information category'})
                       +Y.KC.html('btn',{action:'close',title:'close pod'})
                   ,bodyContent:''
                   ,footerContent:Y.KC.html('btn',{action:'save',title:'save' ,label:'save'})
                   ,visible:cfg.visible
                   ,width  :cfg.width
                   ,xy     :cfg.xy
                   ,zIndex :cfg.zIndex
                }).render();
                //shortcuts
                    h.hd     =h.ol.headerNode;
                    h.bd     =h.ol.bodyNode;
                    h.ft     =h.ol.footerNode;
                    h.bb     =h.ol.get('boundingBox');
                    h.add    =h.hd.one('.kc-add');
                    h.close  =h.hd.one('.kc-close');
            }
           ,info:function(){
                var nn=Y.Node.create(
                    '<fieldset class="kc-record kc-record-grp">'
                   +  '<legend>'
                   +    '<input type="text" class="kc-data kc-data-name kc-enable kc-enable-admin" placeholder="team/group name" title="team/group name" />'
                   +    '<span class="kc-data kc-data-created"></span> '
                   +    Y.KC.html('btn',{action:'remove',label:'remove new group',classes:'kc-remove-grp'})
                   +  '</legend>'
                   +  '<fieldset class="kc-association">'
                   +    '<legend>association with parent group</legend>'
                   +    '<textarea></textarea>'
                   +  '</fieldset>'
                   +  'public contact details<br />'
                   +  '<textarea class="kc-data kc-data-contactDetail kc-enable kc-enable-admin" placeholder="contact details (public)"></textarea>'
                   +  '<div class="kc-tags-social"></div>'
                   +  '<div class="kc-tags-business"></div>'
                   +'</fieldset>'
                );
                h.bd.append(nn);
                nn.setData('tv',new Y.TabView({
                        children:[
                            {label:'about',content:
                                '<div class="kc-grpInfo-options">'
                               +  '<select>'
                               +    '<option>new category...</option>'
                               +    '<option>define your own...</option>'
                               +  '</select>'
                               +  '<em style="font-size:0.6em;color:#999;">drag to reorder, click to select</em>'
                               +  '<ul class="kc-grpInfo-list"></ul>'
                               +'</div>'
                               +'<div class="kc-grpInfo-content"></div>'
                            }
                        ,{label:'members',content:''}
                        ,{label:'events' ,content:'loading...'}
                        ]
                    }).render(nn)
                );
                return nn;
            }
           ,grpInfo:function(p){
                var nnList=Y.Node.create(
                        '<li class="kc-record kc-btn kc-vert">'
                       +  '<em></em><input class="kc-data-category" title="category name" />'
                       +'</li>'
                    )
                   ,nnContent=Y.Node.create(
                        '<fieldset class="kc-record">'
                       +  '<legend><em title="original category name"></em> '
                       +    '<select class="kc-data-viewable">'
                       +      '<option value="0">Public view</option>'
                       +      '<option value="1">Group member view</option>'
                       +    '</select>'
                       +    Y.KC.html('btn',{action:'remove',classes:'kc-remove-grpInfo'})
                       +  '</legend>'
                       +  '<span class="kc-data-info kc-editor">description goes here</span>'
                       +'</fieldset>'
                    )
                ;
                p.node.one('.kc-grpInfo-list'   ).append(nnList);
                p.node.one('.kc-grpInfo-content').append(nnContent);
                nnList   .setData('relatedNode',nnContent);
                nnContent.setData('relatedNode',nnList);
                return {list:nnList,content:nnContent};
            }
           ,grpUsr:function(p){
                var nn=Y.Node.create(
                        '<li class="record record-grpUsr">'
                       +  '<input type="hidden" class="data data-id" />'
                       +  '<input type="text" class="data data-nameFirst" placeholder="first name" title="first name" />'
                       +  '<input type="text" class="data data-nameLast"  placeholder="last name"  title="last name" />'
                       +  d.grpUsrInterest
                       +  Y.KC.html('btn',{action:'find'  ,title:'find contact'})
                       +  Y.KC.html('btn',{action:'remove',title:'remove record'})
                       +'</li>'
                    )
                ;
                p.node.append(nn);
                return nn;
            }
        };

        trigger={
            close:function(){
                h.ol.hide();
                delete h.mask;
                Y.KC.widget.dialogMask.hide();
            }
           ,grpInfoRecordFocus:function(e){
                var recNode=this.ancestor('.kc-record')
                   ,contentNode=recNode.getData('relatedNode')
                ;
                recNode.get('parentNode').all('.kc-record-focus').removeClass('kc-record-focus');
                recNode.addClass('kc-record-focus');
                contentNode.get('parentNode').all('>fieldset').setStyle('display','none');
                contentNode.setStyle('display','');
            }
           ,grpInfoSelectOption:function(e,idx){
                var idx=this.get('selectedIndex')
                   ,panel      =this.ancestor('.yui3-tab-panel')
                   ,list       =panel.one('.kc-grpInfo-list')
                   ,content    =panel.one('.kc-grpInfo-content')
                   ,grpNode    =this.ancestor('.kc-record-grp')
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
                nn.list.one('.kc-data-category').set('value',newCategory);
                nn.content.one('legend em').setContent(newCategory);
                nn.list.one('input').simulate('click');
            }
        };

        /**
         *  load & initialise
         */
        Y.KC.dataSet.fetch([
        ],function(){

            render.base();
            initialise();
            listeners();

        });
    };

},'1.0 August 2012',{requires:['base','io','node']});

/** /mod/grp.js
 *
 *  Kauri Coast Promotion Society
 *
 */
YUI.add('kc-mod-grp',function(Y){

    Y.namespace('KC.mod').grp=function(cfg){

        if(typeof cfg==='undefined' ||
           typeof cfg.node==='undefined'
        ){alert('mod-grp insuffient parameters');return;}

        cfg=Y.merge({
            title:'groups/teams'
        },cfg);

        this.info={
            id         :'grp'
           ,title      :cfg.title
           ,description:'group/team system'
           ,file       :'/mod/grp.js'
           ,version    :'v1.0 August 2012'
        };

        var self=this
           ,d={
                TG_COLLECTION_GRP_SOCIAL:1
               ,TG_COLLECTION_GRP_BUSINESS:2
               ,TG_COLLECTION_TABLE_GRP_SOCIAL:1
               ,TG_COLLECTION_TABLE_GRP_BUSINESS:2
               ,list:{}
            }
           ,h={
                grid:{}
               ,list:{}
            }
            //functions
           ,initialise={}
           ,io={}
           ,listeners
           ,pod={}
           ,populate={}
           ,render={}
           ,trigger={}
        ;

        this.get=function(what){
        };
        this.set=function(what,value){
            if(what==='cfg'){cfg=Y.merge(cfg,value);}
        };

        this.my={}; //children

        /**
         * private
         */

        initialise=function(){
            cfg.node.addClass('kc-mod-'+self.info.id);
            h.filtersbb.setStyle('display','none');
            //tags
                d.list.social  =[];
                d.list.business=[];
                Y.each(KC.data.tgCollectionTag,function(tgCollectionTag){
                    if(tgCollectionTag.collection===d.TG_COLLECTION_GRP_SOCIAL){
                        d.list.social.push({
                            name:KC.data.tgTag[tgCollectionTag.tag].name
                           ,id  :tgCollectionTag.tag
                        });
                    }
                    if(tgCollectionTag.collection===d.TG_COLLECTION_GRP_BUSINESS){
                        d.list.business.push({
                            name:KC.data.tgTag[tgCollectionTag.tag].name
                           ,id  :tgCollectionTag.tag
                        });
                    }
                });
                h.list.social=new Y.KC.widget.List({
                    elements:d.list.social
                   ,selected:[]
                   ,selectorPrompt:'+social tag'
                }).render(h.tagsSocial);
                h.list.business=new Y.KC.widget.List({
                    elements:d.list.business
                   ,selected:[]
                   ,selectorPrompt:'+business tag'
                }).render(h.tagsBusiness);
        };

        io={
            fetch:{
                grp:function(){
                    Y.io('/db/table/grp/s.php',{
                        method:'POST'
                       ,on:{complete:function(id,o){Y.fire('db-grp:available',Y.JSON.parse(o.responseText)[0].result);}}
                       ,data:Y.JSON.stringify([{criteria:{grpIds:[]}}]) //all groups
                    });
                }
            }
           ,set:{
                grpUsr:function(e){
                    var post={}
                       ,grp
                       ,reason
                    ;
                    //sentry
                        if(!this.hasClass('kc-memberRequest-membership') && !this.hasClass('kc-memberRequest-cancel')){return;}
                    grp=h.grpDataTable.getRecord(e.currentTarget.get('id')).toJSON();
                    if(this.hasClass('kc-memberRequest-membership')){
                        reason=prompt('please supply a message for the "'+grp.name+'" administration team');
                        if(reason===null){return;}
                        post={data:{
                            grp       :grp.id
                           ,joinReason:reason
                           ,usr       :KC.user.usr.id
                        }}
                    }else
                    if(this.hasClass('kc-memberRequest-cancel')){
                        post={data:{id:grp.grpUsr},remove:true};
                    }
                    Y.io('/db/table/grpUsr/u.php',{
                        method:'POST'
                       ,on:{complete:io.fetch.grp}
                       ,data:Y.JSON.stringify([post])
                    });
                }
            }
        };

        listeners=function(){
            h.caseSensitive.on('click',populate.grp);
            h.grpName.on('keyup',populate.grp);
            h.filtersBtn.on('click',function(){
                if(h.filtersbb.getStyle('display')==='none'){
                    h.filtersbb.setStyle('display','');
                    this.setContent('hide advanced search');
                }else{
                    h.filtersbb.setStyle('display','none');
                    this.setContent('show advanced search');
                }
            })
            h.list.social  .on('selectedChange',populate.grp)
            h.list.business.on('selectedChange',populate.grp)
            //custom
                Y.on('kc:logout'       ,trigger.loggedOut);
                Y.on('kc:logon'        ,io.fetch.grp);
                Y.on('db-grp:available',populate.grp);
        };

        pod={
            display:{
                grpEdit:function(e){
                    h.podInvoke=e.currentTarget;
                    if(!self.my.podGrpEdit){
                        pod.load.grpEdit();
                        return false;
                    }
                    self.my.podGrpEdit.display({grpIds:[parseInt(this.get('value'),10)]});
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
                    grp=h.grpDataTable.getRecord(e.currentTarget.get('id')).toJSON();
                    //html
                        body+='<em style="font-size:1.6em;font-weight:bold;color:#800">'+grp.name+'</em>';
                        body+='<img style="position:fixed;z-index:-1;bottom:0;left:0;" src="/css/img/kauriTreeTiny.png" />';
                        body+='<img style="position:fixed;z-index:-1;bottom:0;right:0" src="/css/img/ManganuiBluffTiny.png" />';
                        body+='<p>Created: '+new Date(grp.created*1000).toString()+'</p>';
                        body+='<p>Contact Details: '+(grp.contactDetail===null?'not specified yet':grp.contactDetail)+'</p>';
                        //tags
                            Y.each(KC.rs.grpTags.data,function(grpTag){
                                if(grpTag.pk!==grp.id){return;}
                                tags.push(KC.data.tgTag[grpTag.tag].name);
                            });
                            if(tags.length>0){body+='<p>Tags: '+tags.join()+'</p>';}
                        //members
                            Y.each(KC.rs.grpUsr.data,function(grpUsr){
                                if(grpUsr.grp===grp.id){
                                    x=KC.rs.usr.data[grpUsr.usr];
                                    users.push(
                                        (x.knownAs!==null?x.knownAs:x.firstName)
                                    +(grpUsr.admin!==null?'<em>[admin]</em>':'')
                                    +' ('+x.publicDetails+')'
                                    );
                                }
                            });
                            if(users.length>0){
                                body+='<p>Members: '+users.join()+'</p>';
                            }
                        //info
                            Y.each(KC.rs.grpInfo.data,function(grpInfo){
                                if(grpInfo.grp===grp.id){
                                    body+='<em class="kc-style-light">'+grpInfo.category+'</em><p class="kc-style-light">'+grpInfo.info+'</p>';
                                }
                            });
                    self.my.podReport.display({
                        html   :'<html><head><title>'+grp.name+'</title></head><body>'+body+'</body></html>'
                       ,subject:'report'
                       ,sendTo :'joe@dargaville.net'
                       ,title  :grp.name
                    });
                }
            }
           ,load:{
                grpEdit:function(){
                    Y.use('kc-pod-grpEdit',function(Y){
                        self.my.podGrpEdit=new Y.KC.pod.grpEdit();
                        Y.KC.whenAvailable.inDOM(self,'my.podGrpEdit',function(){h.podInvoke.simulate('click');});
                    });
                }
               ,report:function(){
                    Y.use('kc-pod-report',function(Y){
                        self.my.podReport=new Y.KC.pod.report({'zIndex':9999});
                        //listeners
                        Y.KC.whenAvailable.inDOM(self,'my.podReport',function(){h.podInvoke.simulate('click');});
                    });
                }
            }
        };

        populate={
            grp:function(rs){
                KC.rs=Y.merge(KC.rs,rs);
                var records=[]
                   ,grpName=h.grpName.get('value')
                   ,filterChecked=h.caseSensitive.get('checked')
                   ,grpNameFilter
                   ,groupName
                   ,tagFilter={
                       social  :h.list.social  .get('selected')
                      ,business:h.list.business.get('selected')
                    }
                ;
                if(grpName!==''){
                    grpNameFilter=filterChecked
                        ?grpName
                        :grpName.toLowerCase();
                }
                //format data
                    Y.each(KC.rs.grp.data,function(grp){
                        var tags={
                                social     :[]
                               ,socialIds  :[]
                               ,socialOk   :true
                               ,business   :[]
                               ,businessIds:[]
                               ,businessOk :true
                            }
                        ;
                        //default
                            grp.memberCol='';
                            grp.sinceCol ='';
                            grp.usr      =null;
                            grp.grpUsr   =null;
                        //grp name filter
                            if(grpName!==''){
                                groupName=filterChecked
                                    ?grp.name
                                    :grp.name.toLowerCase();
                                if(groupName.indexOf(grpNameFilter)===-1){return;}
                            }
                        //tags
                            Y.each(KC.rs.grpTags.data,function(tagLink){
                                if(tagLink.pk!==grp.id){return;}
                                if(tagLink.collectionTable===d.TG_COLLECTION_TABLE_GRP_SOCIAL){
                                    tags.social   .push(KC.data.tgTag[tagLink.tag].name);
                                    tags.socialIds.push(tagLink.tag);
                                }
                                if(tagLink.collectionTable===d.TG_COLLECTION_TABLE_GRP_BUSINESS){
                                    tags.business   .push(KC.data.tgTag[tagLink.tag].name);
                                    tags.businessIds.push(tagLink.tag);
                                }
                            });
                            grp.social  =tags.social.join();
                            grp.business=tags.business.join();
                            //filter
                                tags.socialOk  =true;
                                tags.businessOk=true;
                                if(tagFilter.social.length>0){
                                    tags.socialOk=Y.Array.find(tags.socialIds,function(tag){
                                        return Y.Array.indexOf(tagFilter.social,tag)!==-1;
                                    })!==null;
                                }
                                if(tagFilter.business.length>0){
                                    tags.businessOk=Y.Array.find(tags.businessIds,function(tag){
                                        return Y.Array.indexOf(tagFilter.business,tag)!==-1;
                                    })!==null;
                                }
                                if((tagFilter.social.length>0 && !tags.socialOk) ||
                                   (tagFilter.business.length>0 && !tags.businessOk)
                                ){return;}
                        //member
                            if(typeof KC.user.usr!=='undefined'){
                                //default
                                    grp.memberCol='<button class="kc-memberRequest-membership" value="'+grp.id+'">request</button>';
                                    grp.usr=KC.user.usr;
                                if(typeof KC.rs.grpUsr!=='undefined'){
                                    Y.each(KC.rs.grpUsr.data,function(grpUsr){
                                        var pendingMembers=0
                                        ;
                                        //sentry
                                            if(grpUsr.grp!==grp.id || grpUsr.usr!==KC.user.usr.id){return;}
                                        //admin/member/pending
                                        if(grpUsr.admin!==null){
                                            //pending members
                                                Y.each(KC.rs.grpUsr.data,function(pendingGrpUsr){
                                                    if(pendingGrpUsr.grp===grp.id && pendingGrpUsr.member===null && pendingGrpUsr.joinRequest!==null){pendingMembers++;}
                                                });
                                            grp.memberCol='<button class="kc-user-admin" value="'+grp.id+'">admin'+(pendingMembers===0?'':' [Pending('+pendingMembers+')]')+'</button>';
                                            grp.sinceCol=Y.DataType.Date.format(new Date(grpUsr.admin*1000),{format:'%d %b %G'});
                                        }else if(grpUsr.member!==null){
                                            grp.memberCol='<button class="kc-user-member" value="'+grp.id+'">member</button>';
                                            grp.sinceCol=Y.DataType.Date.format(new Date(grpUsr.member*1000),{format:'%d %b %G'});
                                        }else if(grpUsr.joinRequest!==null){
                                            grp.memberCol='<button class="kc-memberRequest-cancel" value="'+grpUsr.id+'">pending - cancel</button><br/>'+grpUsr.joinReason;
                                            grp.sinceCol=Y.DataType.Date.format(new Date(grpUsr.joinRequest*1000),{format:'%d %b %G'});
                                            grp.grpUsr=grpUsr.id;
                                        }
                                    });
                                }
                            }
                        records.push(grp);
                    });
                if(h.grpDataTable){h.grpDataTable.set('data',records);}
                else{
                    h.grpDataTable=new Y.DataTable({
                        caption:'Kauri Coast Groups/Teams'
                       ,columns:[
                            {key:'name'                         ,sortable:true}
                           ,{key:'memberCol',label:'member'     ,sortable:true ,allowHTML:true,formatter:function(o){return '<input type="hidden" class="data data-id" value="'+o.data.id+'"/>'+o.value;}}
                           ,{key:'sinceCol' ,label:'since'      ,sortable:true}
                           ,{key:'social'   ,label:'social tags'}
                           ,{key:'business' ,label:'business tags'}
                           ,{                label:'projects'}
                           ,{                label:'meetings'}
                           ,{                label:'events'}
                        ]
                       ,data:records
                    }).render(h.grid);
                    //listeners
                        h.grpDataTable.get('contentBox').delegate('click',pod.display.report,'tr');
                        h.grpDataTable.get('contentBox').delegate('click',io.set.grpUsr,'button');
                        h.grpDataTable.get('contentBox').delegate('click',pod.display.grpEdit,'button.kc-user-admin');
                }
                h.grpDataTable.sort('name');
            }
        };

        render={
            base:function(){
                cfg.node.setContent(
                    'name filter ('
                   +'<label><input type="checkbox" />case sensitive</label>'
                   +') <input class="kc-data kc-data-grpName" type="text" placeholder="team/group" title="team/group name filter" />'
                   +'<button>show advanced search</button>'
                   +'<div class="kc-display-filters">'
                   +  ' filters (include any):<br/>'
                   +  '<div class="kc-tags-social"></div>'
                   +  '<div class="kc-tags-business"></div>'
                   +'</div>'
                   +'<div class="kc-grid"></div>'
                );
                //shortcuts
                    h.grpName      =cfg.node.one('.kc-data-grpName');
                    h.caseSensitive=cfg.node.one('> label > input');
                    h.filtersBtn   =cfg.node.one('> button');
                    h.filtersbb    =cfg.node.one('> .kc-display-filters');
                    h.tagsSocial   =h.filtersbb.one('.kc-tags-social');
                    h.tagsBusiness =h.filtersbb.one('.kc-tags-business');
                    h.grid         =cfg.node.one('.kc-grid');
            }
        };

        trigger={
            loggedOut:function(){
                //clear result set
                if(typeof KC.rs.grpUsr!=='undefined'){delete KC.rs.grpUsr;}
                io.fetch.grp();
            }
        };
        /**
         *  load & initialise
         */
        Y.KC.dataSet.fetch([
            ['grp','id']
        ],function(){

            render.base();
            initialise();
            listeners();

            io.fetch.grp();

        });
    };

},'1.0 June 2012',{requires:['base','io','node']});
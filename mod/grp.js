/** //mod/grp.js
 *
 */
YUI.add('j-mod-grp',function(Y){

    Y.namespace('J.mod').grp=function(cfg){

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
            cfg.node.addClass('j-mod-'+self.info.id);
            h.filtersbb.setStyle('display','none');
            //tags
                d.list.social  =[];
                d.list.business=[];
                Y.each(J.data.tgCollectionTag,function(tgCollectionTag){
                    if(tgCollectionTag.collection===d.TG_COLLECTION_GRP_SOCIAL){
                        d.list.social.push({
                            name:J.data.tgTag[tgCollectionTag.tag].name
                           ,id  :tgCollectionTag.tag
                        });
                    }
                    if(tgCollectionTag.collection===d.TG_COLLECTION_GRP_BUSINESS){
                        d.list.business.push({
                            name:J.data.tgTag[tgCollectionTag.tag].name
                           ,id  :tgCollectionTag.tag
                        });
                    }
                });
                h.list.social=new Y.J.widget.List({
                    elements:d.list.social
                   ,selected:[]
                   ,selectorPrompt:'+social tag'
                }).render(h.tagsSocial);
                h.list.business=new Y.J.widget.List({
                    elements:d.list.business
                   ,selected:[]
                   ,selectorPrompt:'+business tag'
                }).render(h.tagsBusiness);
        };

        io={
            set:{
                grpUsr:function(e){
                    var post={}
                       ,grp
                       ,reason
                    ;
                    //sentry
                        if(!this.hasClass('j-memberRequest-membership') && !this.hasClass('j-memberRequest-cancel')){return;}
                    grp=h.grpDataTable.getRecord(e.currentTarget.get('id')).toJSON();
                    if(this.hasClass('j-memberRequest-membership')){
                        reason=prompt('please supply a message for the "'+grp.name+'" administration team');
                        if(reason===null){return;}
                        post={data:{
                            grp       :grp.id
                           ,joinReason:reason
                           ,usr       :J.user.usr.id
                        }}
                    }else
                    if(this.hasClass('j-memberRequest-cancel')){
                        post={data:{id:grp.grpUsr},remove:true};
                    }
                    Y.io('/db/usrGrpRole_u.php',{
                        method:'POST'
                       ,on:{complete:J.db.grp}
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
                Y.on('j:logout'  ,trigger.loggedOut);
                Y.on('j:logon'   ,J.db.grp);
                Y.on('j-db-grp:s',populate.grp);
        };

        pod={
            display:{
                grp:function(e){
                    h.podInvoke=e.currentTarget;
                    if(!self.my.podGrp){
                        pod.load.grp();
                        return false;
                    }
                    self.my.podGrp.display({grpIds:[parseInt(this.get('value'),10)]});
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
                            Y.each(J.rs.grpTags.data,function(grpTag){
                                if(grpTag.pk!==grp.id){return;}
                                tags.push(J.data.tgTag[grpTag.tag].name);
                            });
                            if(tags.length>0){body+='<p>Tags: '+tags.join()+'</p>';}
                        //members
                            Y.each(J.rs.grpUsr.data,function(grpUsr){
                                if(grpUsr.grp===grp.id){
                                    x=J.rs.usr.data[grpUsr.usr];
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
                            Y.each(J.rs.grpInfo.data,function(grpInfo){
                                if(grpInfo.grp===grp.id){
                                    body+='<em class="j-style-light">'+grpInfo.category+'</em><p class="j-style-light">'+grpInfo.info+'</p>';
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
                grp:function(){
                    Y.use('j-pod-grp',function(Y){
                        self.my.podGrp=new Y.J.pod.grp();
                        Y.J.whenAvailable.inDOM(self,'my.podGrp',function(){h.podInvoke.simulate('click');});
                    });
                }
               ,report:function(){
                    Y.use('j-pod-report',function(Y){
                        self.my.podReport=new Y.J.pod.report({'zIndex':9999});
                        //listeners
                        Y.J.whenAvailable.inDOM(self,'my.podReport',function(){h.podInvoke.simulate('click');});
                    });
                }
            }
        };

        populate={
            grp:function(rs){
                J.rs=Y.merge(J.rs,rs[0].result);
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
                    Y.each(J.rs.grp.data,function(grp){
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
                            Y.each(J.rs.grpTags.data,function(tagLink){
                                if(tagLink.pk!==grp.id){return;}
                                if(tagLink.collectionTable===d.TG_COLLECTION_TABLE_GRP_SOCIAL){
                                    tags.social   .push(J.data.tgTag[tagLink.tag].name);
                                    tags.socialIds.push(tagLink.tag);
                                }
                                if(tagLink.collectionTable===d.TG_COLLECTION_TABLE_GRP_BUSINESS){
                                    tags.business   .push(J.data.tgTag[tagLink.tag].name);
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
                            if(typeof J.user.usr!=='undefined'){
                                //default
                                    grp.memberCol='<button class="j-memberRequest-membership" value="'+grp.id+'">request</button>';
                                    grp.usr=J.user.usr;
                                if(typeof J.rs.grpUsr!=='undefined'){
                                    Y.each(J.rs.grpUsr.data,function(grpUsr){
                                        var pendingMembers=0
                                        ;
                                        //sentry
                                            if(grpUsr.grp!==grp.id || grpUsr.usr!==J.user.usr.id){return;}
                                        //admin/member/pending
                                        if(grpUsr.admin!==null){
                                            //pending members
                                                Y.each(J.rs.grpUsr.data,function(pendingGrpUsr){
                                                    if(pendingGrpUsr.grp===grp.id && pendingGrpUsr.member===null && pendingGrpUsr.joinRequest!==null){pendingMembers++;}
                                                });
                                            grp.memberCol='<button class="j-user-admin" value="'+grp.id+'">admin'+(pendingMembers===0?'':' [Pending('+pendingMembers+')]')+'</button>';
                                            grp.sinceCol=Y.DataType.Date.format(new Date(grpUsr.admin*1000),{format:'%d %b %G'});
                                        }else if(grpUsr.member!==null){
                                            grp.memberCol='<button class="j-user-member" value="'+grp.id+'">member</button>';
                                            grp.sinceCol=Y.DataType.Date.format(new Date(grpUsr.member*1000),{format:'%d %b %G'});
                                        }else if(grpUsr.joinRequest!==null){
                                            grp.memberCol='<button class="j-memberRequest-cancel" value="'+grpUsr.id+'">pending - cancel</button><br/>'+grpUsr.joinReason;
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
                        h.grpDataTable.get('contentBox').delegate('click',pod.display.grp,'button.j-user-admin');
                }
                h.grpDataTable.sort('name');
            }
        };

        render={
            base:function(){
                cfg.node.setContent(
                    'name filter ('
                   +'<label><input type="checkbox" />case sensitive</label>'
                   +') <input class="j-data j-data-grpName" type="text" placeholder="team/group" title="team/group name filter" />'
                   +'<button>show advanced search</button>'
                   +'<div class="j-display-filters">'
                   +  ' filters (include any):<br/>'
                   +  '<div class="j-tags-social"></div>'
                   +  '<div class="j-tags-business"></div>'
                   +'</div>'
                   +'<div class="j-grid"></div>'
                );
                //shortcuts
                    h.grpName      =cfg.node.one('.j-data-grpName');
                    h.caseSensitive=cfg.node.one('> label > input');
                    h.filtersBtn   =cfg.node.one('> button');
                    h.filtersbb    =cfg.node.one('> .j-display-filters');
                    h.tagsSocial   =h.filtersbb.one('.j-tags-social');
                    h.tagsBusiness =h.filtersbb.one('.j-tags-business');
                    h.grid         =cfg.node.one('.j-grid');
            }
        };

        trigger={
            loggedOut:function(){
                //clear result set
                if(typeof J.rs.grpUsr!=='undefined'){delete J.rs.grpUsr;}
                J.db.grp();
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

            J.db.grp.io();

        });
    };

},'1.0 June 2012',{requires:['base','io','node']});

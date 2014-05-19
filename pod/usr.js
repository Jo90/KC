//pod/usr.js

YUI.add('j-pod-usr',function(Y){

    Y.namespace('J.pod').usr=function(cfg){

        cfg=Y.merge({
            title :'my profile',
            width :'800px',
            xy    :[10,20]
        },cfg);

        this.info={
            id         :'usr',
            title      :cfg.title,
            description:'Individual details',
            file       :'/pod/usr.js',
            version    :'v1.1 May 2014'
        };

        var self=this,
            d={
                TAG_COLLECTION_USR:3,
                list:{}
            },
            h={
                grid:{},
                list:{}
            },
            //functions
            initialise={},
            io={},
            listeners,
            pod={},
            populate={},
            render={}
        ;

        this.customEvent={
            save:self.info.id+(++J.env.customEventSequence)+':save'
        };

        this.display=function(p){
            cfg=Y.merge(cfg,p);
            h.pl.show();
            io.fetch.usr();
        };

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
            h.pl.get('boundingBox').addClass('j-pod-'+self.info.id);
            //tag collections
                d.list.myTagsAll=[];
                Y.each(J.data.tagCollectionTag,function(tagCollectionTag){
                    if(tagCollectionTag.collection===d.TAG_COLLECTION_USR){
                        d.list.myTagsAll.push({
                            id  :tagCollectionTag.tag
                           ,name:J.data.tag[tagCollectionTag.tag].name
                        });
                    }
                });
        };

        io={
            fetch:{
                usr:function(){
                    Y.io('/db/usr_s.php',{
                        method:'POST',
                        on:{complete:function(id,o){Y.fire('db-usr:available',Y.JSON.parse(o.responseText)[0].result);}},
                        data:Y.JSON.stringify([{criteria:{
                           usrIds:[J.user.usr.id]
                        }}])
                    });
                }
            },
            update:{
                usr:function(){

                    var usrId=J.user.usr.id,
                        usr={
                            data:{
                                id           :usrId,
                                title        :h.pl.bodyNode.one('.j-data-title'    ).get('value'),
                                firstName    :h.pl.bodyNode.one('.j-data-firstName').get('value'),
                                lastName     :h.pl.bodyNode.one('.j-data-lastName' ).get('value'),
                                knownAs      :h.pl.bodyNode.one('.j-data-knownAs'  ).get('value')
                            },
                            remove:h.removeMe.get('checked'),
                            children:{
                                usrInfo:[],
                                tagLink:[{data:{
                                    dbTable   :J.data.dbTable.usr.id,
                                    collection:d.TAG_COLLECTION_USR,
                                    tagIds    :h.myTagsList.get('selected'),
                                    pk        :usrId
                                }}]
                            }
                        },
                        post={criteria:{usr:[usr]}}
                    ;
                    Y.io('/db/usr_u.php',{
                        method:'POST',
                        on:{complete:function(id,o){Y.fire('db-usr:available',Y.JSON.parse(o.responseText)[0].result);}},
                        data:Y.JSON.stringify([post])
                    });
                }
            }
        };

        listeners=function(){
            //me
/*
                h.removeMe.on('click',function(){if(this.get('checked')){this.set('checked',confirm('Checking this box will remove you when saved'));}});
                h.saveMyDetails.on('click',io.update.usr);
*/
            //custom
                Y.on('db-usr:available',populate.usr);
                Y.on('j:logout',function(){
                    h.tvUsr.destroy();
                    h.pl.destroy();
                });
        };

        pod={
            display:{
            },
            load:{
            },
            result:{
            }
        };

        populate={
            usr:function(rs){
                J.rs=Y.merge(J.rs,rs);
                var grpUsrRecords=[],
                    usr,
                    list={}
                ;
                usr=Y.J.firstRecord(J.rs.usr.data);
                h.pl.bodyNode.one('.j-data-title'    ).set('value',usr.title);
                h.pl.bodyNode.one('.j-data-firstName').set('value',usr.firstName);
                h.pl.bodyNode.one('.j-data-lastName' ).set('value',usr.lastName);
                h.pl.bodyNode.one('.j-data-knownAs'  ).set('value',usr.knownAs);
            }
        };

        render={
            base:function(){
                h.pl=new Y.Panel({
                    headerContent:
                        '<span title="pod:'+self.info.id+' '+self.info.version+' '+self.info.description+'">'+self.info.title+'</span>',
                    bodyContent:
                         '<input class="j-data j-data-title"     placeholder="title"      title="mr/mrs/miss/sir..." /> '
                        +'<input class="j-data j-data-firstName" placeholder="first name" title="first name" /> '
                        +'<input class="j-data j-data-lastName"  placeholder="last name"  title="last name" /> '
                        +'<input class="j-data j-data-knownAs"   placeholder="known as"   title="also known as" />'
                        +Y.J.html('btn',{action:'save',label:'save details'})
                        +'<div class="j-tags"></div>'
                        +'<div class="j-related-data"></div>',
                    visible:false,
                    modal  :true,
                    width  :cfg.width,
                    xy     :cfg.xy,
                    zIndex:9999
                })
                .plug(Y.Plugin.Drag,{handles:['.yui3-widget-hd']})
                .render();

                h.tv=new Y.TabView({
                    children:[
                        {label:'private groups',content:
                            'all non organisational groups i.e. family, work, friends, etc...'
                        },
                        {label:'groups/teams',content:'popup as shared with organisations'},
                        {label:'contact details',content:'popup as shared with organisations'},
                        {label:'address details',content:'popup as shared with organisations'},
                        {label:'actions',content:
                            '<ul>'
                           +    '<li>change password</li>'
                           +    '<li>leave group - ask for reason</li>'
                           +    '<li>leave private group - ask for reason</li>'
                           +    '<li>suspend account - ask for reason</li>'
                           +'</ul>'
                           +'<p>Notes: Must terminate each group membership before suspending account.  Display "terminate my account" button only when no memberships exist, however, have this explaination by disabled button.</p>'
                        }
                    ]
                }).render(h.pl.bodyNode.one('.j-related-data'));
                //tabview listeners

                h.tv.after('selectionChange',function(e){
                    var idx=h.tv.indexOf(this.get('selection'))
                    ;
                    debugger;
                    if(idx===0){
                        if(self.my.grp==undefined){
                            Y.use('j-pod-grp',function(Y){
                                self.my.grp=new Y.J.pod.grp({
                                    private:true,
                                    dbTable:'usr',
                                    pk     :J.user.usr.id,
                                    title  :'finish this'
                                });
                            });
                        }
                    }
                    if(idx===1){

                    }
                });
            }
        };

        //load & initialise

        Y.J.dataSet.fetch([
            ['grp','id']
        ],function(){

            render.base();
            initialise();
            listeners();

        });
    };

},'1.1 May 2014',{requires:['base','io','node']});

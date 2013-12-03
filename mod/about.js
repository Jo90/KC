//mod/about.js

YUI.add('j-mod-about',function(Y){

    Y.namespace('J.mod').about=function(cfg){

        if(typeof cfg==='undefined' ||
           typeof cfg.node==='undefined'
        ){alert('mod-about insuffient parameters');return;}

        cfg=Y.merge({
            title :'my stuff'
        },cfg);

        this.info={
            id         :'about'
           ,title      :cfg.title
           ,description:'individual dashboard'
           ,file       :'/mod/about.js'
           ,version    :'v1.0 August 2012'
        };

        var self=this
           ,d={
                TAG_COLLECTION_USR:3
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
                        method:'POST'
                       ,on:{complete:function(id,o){Y.fire('db-usr:available',Y.JSON.parse(o.responseText)[0].result);}}
                       ,data:Y.JSON.stringify([{criteria:{
                           usrIds:[J.user.usr.id]
                        }}])
                    });
                }
            }
           ,update:{
                usr:function(){
                    if(!J.user.usr){return;}
                    var usrId=J.user.usr.id
                       ,usr={
                            data:{
                                id           :usrId
                               ,firstName    :h.isLoggedIn.one('.j-data-firstName'    ).get('value')
                               ,lastName     :h.isLoggedIn.one('.j-data-lastName'     ).get('value')
                               ,knownAs      :h.isLoggedIn.one('.j-data-knownAs'      ).get('value')
                               ,contactDetail:h.isLoggedIn.one('.j-data-publicDetails').get('value')
                            }
                           ,remove:h.removeMe.get('checked')
                           ,children:{
                                usrInfo:[]
                               ,tagLink:[{data:{
                                    dbTable   :J.data.dbTable.usr.id
                                   ,collection:d.TAG_COLLECTION_USR
                                   ,tagIds    :h.myTagsList.get('selected')
                                   ,pk        :usrId
                                }}]
                            }
                        }
                       ,post={criteria:{usr:[usr]}}
                    ;
                    Y.io('/db/usr_u.php',{
                        method:'POST'
                       ,on:{complete:function(id,o){Y.fire('db-usr:available',Y.JSON.parse(o.responseText)[0].result);}}
                       ,data:Y.JSON.stringify([post])
                    });
                }
            }
        };

        listeners=function(){
            h.tvp.hub.delegate('click',function(){
                if(this.hasClass('j-page-grp')){J.my.tabView.selectChild(cfg.main.tv.grp.get('index'));}
                if(this.hasClass('j-page-prj')){J.my.tabView.selectChild(cfg.main.tv.prj.get('index'));}
                if(this.hasClass('j-page-evt')){J.my.tabView.selectChild(cfg.main.tv.evt.get('index'));}
            },'.j-topic');
            h.getInvolved.on('click',function(){alert('How to get involved through group questions, coming...');});
            //me
                h.removeMe.on('click',function(){if(this.get('checked')){this.set('checked',confirm('Checking this box will remove you when saved'));}});
                h.saveMyDetails.on('click',io.update.usr);
                h.requestMembership.on('click',function(){J.my.tabView.selectChild(cfg.main.tv.grp.get('index'));});
            //custom
                Y.on('j:logout',trigger.setConnectionState);
                Y.on('j:logon' ,trigger.setConnectionState);
                Y.on('db-grp:available',populate.usr);
                Y.on('db-usr:available',populate.usr);
        };

        pod={
            display:{
            }
           ,load:{
            }
           ,result:{
            }
        };

        populate={
            usr:function(rs){
                J.rs=Y.merge(J.rs,rs);
                var grpUsrRecords=[]
                   ,usr
                   ,list={}
                ;
                //sentry
                    if(!J.rs.usr){trigger.reset();return;}
                usr=Y.J.firstRecord(J.rs.usr.data);
                h.isLoggedIn.one('.j-data-firstName'    ).set('value',usr.firstName);
                h.isLoggedIn.one('.j-data-lastName'     ).set('value',usr.lastName);
                h.isLoggedIn.one('.j-data-knownAs'      ).set('value',usr.knownAs);
                h.isLoggedIn.one('.j-data-publicDetails').set('value',usr.publicDetails);
                //tags
                    if(!h.myTagsList){
                        h.myTagsList=new Y.J.widget.List({
                            elements:d.list.myTagsAll
                           ,selectorPrompt:'+my interests'
                        }).render(h.myTags);
                    }
                    list.myTags=[];
                    if(typeof J.rs.usrTags!=='undefined'){
                        Y.each(J.rs.usrTags.data,function(usrTag){
                            if(usrTag.collection===d.TAG_COLLECTION_USR){
                                list.myTags.push(usrTag.tag);
                            }
                        });
                    }
                    h.myTagsList.set('selected',list.myTags);
                //groups
                    Y.each(J.rs.grpUsr.data,function(grpUsr){
                        //sentry
                            if(grpUsr.usr!==J.user.usr.id){return;}
                        grpUsr.groupName=J.data.grp[grpUsr.grp].name;
                        grpUsr.info='';
                        if(grpUsr.admin!==null){
                            grpUsr.membership='Administrator';
                            grpUsr.since     =Y.DataType.Date.format(new Date(grpUsr.admin*1000),{format:'%d %b %G'});
                        }else if(grpUsr.member!==null){
                            grpUsr.membership='Member';
                            grpUsr.since     =Y.DataType.Date.format(new Date(grpUsr.member*1000),{format:'%d %b %G'});
                        }else{
                            grpUsr.membership='Pending';
                            grpUsr.since     =Y.DataType.Date.format(new Date(grpUsr.joinRequest*1000),{format:'%d %b %G'});
                            grpUsr.info      =grpUsr.joinReason;
                        }
                        grpUsrRecords.push(grpUsr);
                    });
                if(h.grid.grpUsrDataTable){h.grid.grpUsrDataTable.set('data',grpUsrRecords);}
                else{
                    h.grid.grpUsrDataTable=new Y.DataTable({
                        columns:[
                            {key:'groupName'   ,label:'team/group',sortable:true}
                           ,{key:'membership'  ,label:'membership',sortable:true}
                           ,{key:'since'       ,label:'since'     ,sortable:true}
                           ,{key:'info'        ,label:''          }
                        ]
                    ,data:grpUsrRecords
                    }).render(h.gridMyGrps);
                }
            }
        };

        render={
            base:function(){
                h.tvAbout=new Y.TabView({
                    children:[
                        {label:'information hub',content:
                            '<div class="j-topics">'
                           +  '<div>'
                           +    '<img src="/img/communication.jpg" alt="sharing ideas" title="bringing people together and inspiring communities"/>'
                           +    '<em class="j-title-section">Bringing people together</em>'
                           +    '<em class="j-title-note">Sharing ideas</em>'
                           +    '<ul>'
                           +      '<li class="j-topic j-page-grp">groups</li>'
                           +    '</ul>'
                           +  '</div>'
                           +  '<div>'
                           +    '<img src="/img/workingTogether.png" alt="working together" title="working together"/>'
                           +    '<em class="j-title-section">Working together</em>'
                           +    '<em class="j-title-note">Involvement</em>'
                           +    '<ul>'
                           +      '<li class="j-topic j-page-prj">projects</li>'
                           +    '</ul>'
                           +  '</div>'
                           +  '<div>'
                           +    '<img src="/img/happy.jpg" alt="Wellbeing" title="living life and contributing"/>'
                           +    '<em class="j-title-section">Wellbeing</em>'
                           +    '<em class="j-title-note">Contributing/Receiving<br />Me/Family/Community</em>'
                           +    '<ul>'
                           +      '<li class="j-topic j-page-evt">events</li>'
                           +    '</ul>'
                           +  '</div>'
                           +  '<button class="j-btn-involved">How to get involved</button>'
                           +'</div>'
                           +'</center>'
                        }
                       ,{label:'me',content:
                             '<div class="j-isLoggedOut">You must log in to see this section</div>'
                            +'<div class="j-isLoggedIn">'
                            +  '<fieldset>'
                            +    '<legend>my details</legend>'
                            +    'First name <input class="j-data j-data-firstName" placeholder="first name" />'
                            +    ' Last name <input class="j-data j-data-lastName"  placeholder="last name" />'
                            +    ' Known as <input class="j-data j-data-knownAs"    placeholder="known as" />'
                            +    ' &nbsp; <label><input class="j-remove" type="checkbox" />mark me for removal</label>'
                            +    '<br/>Public contact details<br />'
                            +    '<textarea class="j-data j-data-publicDetails" placeholder="public contact details" /></textarea>'
                            +    '<div class="j-tags-mine"></div>'
                            +    '<br/>User information and categorisation [to be implemented soon...]'
                            +    Y.J.html('btn',{action:'save',label:'save details'})
                            +  '</fieldset>'
                            +  '<fieldset class="j-grid-myGrps">'
                            +    '<legend>my groups <button>request group membership</button></legend>'
                            +  '</fieldset>'
                            +'</div>'
                        }
                    ]
                }).render(cfg.node);
                //shortcuts
                    h.tv={
                        hub:h.tvAbout.item(0)
                       ,me :h.tvAbout.item(1)
                    };
                    h.tvp={
                        hub:h.tv.hub.get('panelNode')
                       ,me :h.tv.me .get('panelNode')
                    };
                    h.getInvolved      =h.tvp.hub.one('.j-btn-involved');
                    h.isLoggedIn       =h.tvp.me.one('.j-isLoggedIn');
                    h.isLoggedOut      =h.tvp.me.one('.j-isLoggedOut');
                    h.myTags           =h.isLoggedIn.one('.j-tags-mine');
                    h.removeMe         =h.isLoggedIn.one('.j-remove');
                    h.saveMyDetails    =h.isLoggedIn.one('.j-save');
                    h.gridMyGrps       =h.isLoggedIn.one('.j-grid-myGrps');
                    h.requestMembership=h.gridMyGrps.one('>legend>button');
            }
        };

        trigger={
            reset:function(){
                if(h.grid.grpUsrDataTable){h.grid.grpUsrDataTable.set('data',[]);}
            }
           ,setConnectionState:function(){
                //logged in
                h.isLoggedIn.hide();
                h.isLoggedOut.hide();
                if(J.user.usr){
                    h.isLoggedIn.show();
                    io.fetch.usr();
                }else{
                    h.isLoggedOut.show();
                }
            }
        };
        /**
         *  load & initialise
         */
        Y.J.dataSet.fetch([
            ['grp','id']
        ],function(){

            render.base();
            initialise();
            listeners();

            trigger.setConnectionState();

        });
    };

},'1.0 August 2012',{requires:['base','io','node']});

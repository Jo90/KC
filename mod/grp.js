//mod/grp.js

YUI.add('j-mod-grp',function(Y){
    "use strict";
    Y.namespace('J.mod').grp=function(cfg){

        cfg=Y.merge({
            title:'groups/teams'
        },cfg);

        this.info={
            id         :'grp',
            title      :cfg.title,
            description:'group/team system',
            file       :'/mod/grp.js',
            version    :'v1.0 January 2014'
        };

        var self=this,
            d={list:{}},
            h={grid:{},list:{}},
            //functions
            initialise={},
            io={},
            listeners,
            pod={},
            refresh={},
            render={}
        ;

        this.get=function(what){
        };
        this.set=function(what,value){
            if(what==='cfg'){cfg=Y.merge(cfg,value);}
        };

        this.my={}; //children

        initialise=function(){
            cfg.node.addClass('j-mod-'+self.info.id);
            h.filters.setStyle('display','none');
            //show/hide if logged in
            h.dtcb.all('tr *:nth-child(2)').setStyle('display','none');
            cfg.node.one('>.j-notLoggedOn').setStyle('display',J.user.usr!==undefined?'none':'');
            cfg.node.one('>.j-add-grp'    ).setStyle('display',J.user.usr===undefined?'none':'');
        };

        io={
            fetch:{
                grp:function(){
                    Y.io('/db/grp_s.php',{
                        method:'POST',
                        on:{complete:refresh.grp},
                        data:Y.JSON.stringify([{criteria:{restrict:0}}])
                    });
                },
                member:function(){
                    Y.io('/db/member_s.php',{
                        method:'POST',
                        on:{complete:refresh.member},
                        data:Y.JSON.stringify([{criteria:{
                            dbTable:'usr',
                            pk     :J.user.usr.id
                        }}])
                    });
                }
            },
            insert:{
                grp:function(){
                    var grpName=prompt('group name')
                    ;
                    if(grpName===null){return;}
                    if(grpName===''){alert('must supply a group name');return;}
                    Y.io('/db/grp_i.php',{
                        method:'POST',
                        on:{complete:function(){
                            if(d.rsMember!==undefined){delete d.rsMember;} //force member reselect
                            io.fetch.grp();
                        }},
                        data:Y.JSON.stringify([{
                            grp:{
                                records:[{
                                    data:{
                                        name:grpName
                                    },
                                    children:{
                                        member:{
                                            records:[{
                                                data:{
                                                    dbTable:'usr',
                                                    pk     :J.user.usr.id,
                                                },
                                                children:{
                                                    role:{
                                                        records:[{
                                                            data:{
                                                                name  :'Admin',
                                                                starts:moment().unix()-1,
                                                                reason:'Created group'
                                                            }
                                                        }]
                                                    }
                                                }
                                            }]
                                        }
                                    }
                                }]
                            }
                        }])
                    });
                }
            },
            requestMembership:function(){
                var grp=h.dt.getRecord(this).toJSON(),
                    reason=prompt('please supply a message for the "'+grp.name+'" administration team')
                ;
                if(reason===null){return;}
                Y.io('/db/memberRole_i.php',{
                    method:'POST',
                    on:{complete:io.fetch.member},
                    data:Y.JSON.stringify([{
                        member:{
                            records:[{
                                data:{
                                    grp    :grp.id,
                                    dbTable:'usr',
                                    pk     :J.user.usr.id
                                },
                                children:{
                                    role:{
                                        records:[
                                            {data:{
                                                name  :'Pending',
                                                starts:moment().unix()-1,
                                                reason:reason
                                            }}
                                        ]
                                    }
                                }
                            }]
                        }
                    }])
                });
            },
            roleCancel:function(){
                var grp   =h.dt.getRecord(this).toJSON(),
                    role  =this.getData('data'),
                    reason=prompt('please let us know why you are cancelling your role "'+role.name+'"',role.reason)
                ;
                if(reason===null){return;}
                role.ends=moment().unix()-1;
                Y.io('/db/role_u.php',{
                    method:'POST',
                    on:{complete:io.fetch.member},
                    data:Y.JSON.stringify([{
                        role:{
                            records:[{data:role}]
                        }
                    }])
                });
            }
        };

        listeners=function(){
            h.grpName.on('keyup',refresh.grp);
            cfg.node.one('> button').on('click',function(){
                var filter=h.filters.getStyle('display')==='none';
                h.filters.setStyle('display',filter?'':'none');
                this.setContent((filter?'hide':'show')+' advanced search');
            });
            cfg.node.one('>.j-add-grp').on('click',io.insert.grp);
            h.list.social  .on('selectedChange',refresh.grp);
            h.list.business.on('selectedChange',refresh.grp);
            //data table
                h.dt.after('sort',refresh.member);
                h.dtcb.delegate('click',pod.display.grp     ,'tbody .yui3-datatable-col-name');
                h.dtcb.delegate('click',io.requestMembership,'.yui3-datatable-col-member .j-member-request');
                h.dtcb.delegate('click',io.roleCancel       ,'.yui3-datatable-col-member .j-member-role');
                h.dtcb.delegate('click',pod.display.grp     ,'button.j-user-admin');
            //custom
                Y.on('j:logout',refresh.member);
                Y.on('j:logon' ,io.fetch.member);
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
                },
                report:function(e){
                    var grp,
                        body='',
                        tags=[],
                        users=[],
                        x
                    ;
                    //sentry
                        if(e.target.get('tagName')==='BUTTON'){return;}
                    h.podInvoke=e.currentTarget;
                    if(!self.my.podReport){
                        pod.load.report({});
                        return false;
                    }
                    grp=h.dt.getRecord(e.currentTarget.get('id')).toJSON();
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
                        html   :'<html><head><title>'+grp.name+'</title></head><body>'+body+'</body></html>',
                        subject:'report',
                        sendTo :'joe@dargaville.net',
                        title  :grp.name
                    });
                }
            },
            load:{
                grp:function(){
                    Y.use('j-pod-grp',function(Y){
                        self.my.podGrp=new Y.J.pod.grp();
                        Y.J.whenAvailable.inDOM(self,'my.podGrp',function(){h.podInvoke.simulate('click');});
                    });
                },
                report:function(){
                    Y.use('j-pod-report',function(Y){
                        self.my.podReport=new Y.J.pod.report({'zIndex':9999});
                        //listeners
                        Y.J.whenAvailable.inDOM(self,'my.podReport',function(){h.podInvoke.simulate('click');});
                    });
                }
            }
        };

        refresh={
            grp:function(){ //public view
                var groups=[],
                    filterName=h.grpName.get('value').toLowerCase()
                ;
                //invoked from fetch.grp(id,o), ignore if invoked by filter changes
                if(arguments.length===2){
                    d.rsGrp=Y.JSON.parse(arguments[1].responseText)[0].result;
                }
                Y.each(d.rsGrp.grp.data,function(grp){
                    var tags=[]
                    ;
                    //filter
                        if(filterName!==''&&grp.name.toLowerCase().indexOf(filterName)===-1){return;}
                    //tags
                        Y.each(d.rsGrp.tag.data,function(tag){
                            if(tag.dbTable==='grp'&&tag.pk===grp.id){tags.push(tag.name);}
                        });
                        grp.tags=tags.length>0?tags.join(','):'';
                    groups.push(grp);
                });
                h.dt.set('data',groups);
                h.dt.sort('name');
                //logged in
                    if(J.user.usr!==undefined){
                        d.rsMember===undefined
                            ?io.fetch.member()
                            :refresh.member();
                    }
            },
            member:function(){
                //invoked from fetch.member(id,o), logout, and refresh.grp()
                if(arguments.length===2){
                    d.rsMember=Y.JSON.parse(arguments[1].responseText)[0].result;
                }
                if(d.rsMember===undefined){return;}
                //show/hide if logged in
                    h.dtcb.all('tr *:nth-child(2)').setStyle('display',J.user.usr===undefined?'none':'');
                    cfg.node.one('>.j-notLoggedOn').setStyle('display',J.user.usr===undefined?'':'none');
                    cfg.node.one('>.j-add-grp'    ).setStyle('display',J.user.usr===undefined?'none':'');
                h.dt.get('data').each(function(grp,i){
                    var grpId  =grp.get('id'),
                        memberCol=h.dt.getRow(i).one('.yui3-datatable-col-member')
                    ;
                    memberCol.set('innerHTML','');
                    //member
                        Y.each(d.rsMember.member.data,function(member){
                            if(member.grp!==grpId){return;}
                            Y.each(d.rsMember.role.data,function(role){
                                var nn,
                                    now=moment().unix()
                                ;
                                if(role.member===member.id&&role.starts<now&&(role.ends===null||role.ends>now)){
                                    nn=Y.Node.create('<button class="j-member-role" title="since '+moment(role.starts*1000).format('dddd, MMMM Do YYYY, h:mm a')+', '+role.reason+'">'+role.name+'</button>');
                                    memberCol.append(nn);
                                    nn.setData('data',role);
                                }
                            });
                        });
                        if(memberCol.get('innerHTML')===''){
                            memberCol.set('innerHTML','<button class="j-member-request">request</button>');
                        }
                });
            }
        };

        render={
            base:function(){
                cfg.node.setContent(
                    '<span class="j-notLoggedOn"><strong>You must logon to manage your group memberships.</strong><br/><small>(click on &quot;Visitor&quot; in top right corner to create an account.)</small><br/></span>'
                   +'name filter <input class="j-data j-data-grpName" type="text" placeholder="team/group" title="team/group name filter" />'
                   +'<button>show advanced search</button>'
                   +Y.J.html('btn',{action:'add',label:'new group',title:'add new group',classes:'j-add-grp'})
                   +'<div class="j-display-filters">'
                   +  ' filters (include any): Finish!!!!!! also include any/only conditon (to be completed)<br/>'
                   +  '<div class="j-tags"></div>'
                   +'</div>'
                );
                h.dt=new Y.DataTable({
                    columns:[
                        {key:'name'  ,label:'group, select for more...',sortable:true},
                        {key:'member',label:'membership'},
                        {key:'tags'  ,label:'purpose'   },
                        {             label:'projects'  },
                        {             label:'meetings'  },
                        {             label:'events'    }
                    ]
                }).render(cfg.node);
                //shortcuts
                    h.grpName=cfg.node.one('.j-data-grpName');
                    h.filters=cfg.node.one('> .j-display-filters');
                    h.tags   =h.filters.one('.j-tags');
                    h.dtcb   =h.dt.get('contentBox');
                //tags
                    h.list.social=new Y.J.widget.List({
                        elements:[
                            {id:'social'   ,name:'Social'},
                            {id:'youth'    ,name:'Youth'},
                            {id:'support'  ,name:'Support'},
                            {id:'community',name:'Community'}
                        ],
                        selected:['social'],
                        selectorPrompt:'+social tag'
                    }).render(h.tags);
                    h.list.business=new Y.J.widget.List({
                        elements:[
                            {id:'business' ,name:'Business'},
                            {id:'gov'      ,name:'Local government'},
                            {id:'forum'    ,name:'Business forum'}
                        ],
                        selectorPrompt:'+business tag'
                    }).render(h.tags);
            }
        };

        render.base();
        initialise();
        listeners();

        io.fetch.grp();

    };

},'1.0 June 2012',{requires:['base','io','node']});

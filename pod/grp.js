//pod/grp.js

YUI.add('j-pod-grp',function(Y){
    'use strict';
    Y.namespace('J.pod').grp=function(cfg){

        cfg=Y.merge({
            title:'team'
        },cfg);

        this.info={
            id         :'grp',
            title      :cfg.title,
            description:'edit team/group details',
            version    :'v1.1 May 2014'
        };

        var self=this,
            d={
                list:{
                    grpInfoCategories:['Vision','Purpose','Strategy','Scope','Location','Mission','Meetings','History','Plan']
                },
                pod:{}
            },
            h={},
            //functions
            io={},
            listeners,
            pod={},
            populate={},
            record={},
            render={}
        ;

        this.display=function(p){
            cfg=Y.merge(cfg,p);
            h.pl.show();
            h.tv.selectChild(0);
            io.fetch.grp();
        };

        this.my={}; //children

        io={
            fetch:{
                grp:function(){
                    Y.io('/db/grp_s.php',{
                        method:'POST',
                        on:{complete:populate.grp},
                        data:Y.JSON.stringify([{criteria:{
                            grpIds:cfg.grpIds,
                            detailed:true
                        }}])
                    });
                }
            },
            remove:function(){
                if(!confirm('Proceed to remove group "'+h.grp.name+'"')){return;}
                Y.io('/db/grp_u.php',{
                    method:'POST',
                    on:{complete:function(){
                        Y.fire('j:grp:removed');
                        alert('group '+h.grp.name+' removed');
                        h.pl.hide();
                    }},
                    data:Y.JSON.stringify([{grp:{remove:[h.grp.id]}}])
                });
            },
            save:function(){
                var usrId=J.user.usr.id,
                    grp={
                        records:[{
                            data:h.grp,
                            children:{
                                info:{
                                    records:[],
                                    remove:h.tvp.inf.getData('removeIds')||[]
                                },
                                member:{
                                    records:[],
                                    remove:['skill','profile','interest']
                                },
                                tag:{
                                    records:[],
                                    remove:['skill','profile','interest']
                                }
                            }
                        }]
                    }
                ;
                //info
                    h.tvp.inf.all('>div').each(function(n,i){
                        var data=n.getData('data'),
                            category=n.one('.j-data-category').get('value'),
                            r={data:{
                                dbTable :'grp',
                                pk      :h.grp.id,
                                seq     :i,
                                category:(category!=='Other'?category:n.one('.j-data-category-other').get('value')),
                                detail  :n.one('.j-data-detail').get('value')
                            }}
                        ;
                        if(data!==undefined){
                            r.data.id=data.id;
                        }
                        grp.records[0].children.info.records.push(r);
                    });
                //tags
/*
                    Y.each(h.list.grpTags.get('selected'),function(tag,i){
                        grp.records[0].children.tag.records.push({data:{
                            dbTable :'grp',
                            pk      :h.grp.id,
                            seq     :i,
                            category:'skill',
                            tag     :tag
                        }});
                    });
*/
                //address
/*
                    h.pn.addr.all('>div').each(function(n,i){
                        var data=n.getData('data'),
                            r={data:{
                                dbTable :'usr',
                                pk      :usrId,
                                seq     :i,
                                purpose :n.one('.j-data-purpose' ).get('value'),
                                location:(parseInt(n.one('.j-data-location').get('value'),10)||null),
                                detail  :n.one('.j-data-detail'  ).get('value')
                            }}
                        ;
                        if(data!==undefined){
                            r.data.id=data.id;
                        }
                        usr.records[0].children.address.records.push(r);
                    });
*/
                Y.io('/db/grp_u.php',{
                    method:'POST',
                    on:{complete:io.fetch.grp},
                    data:Y.JSON.stringify([{grp:grp}])
                });
            }
        };

        listeners=function(){
            h.bd.one('.j-save').on('click',io.save);
            h.tvp.inf.delegate('change',function(){
                this.ancestor('div').one('.j-data-category-other').setStyle('display',this.get('selectedIndex')===this.all('option').size()-1?'':'none');
            },'>div>select');
            h.tvp.adm.one('.j-remove-grp').on('click',io.remove);
            //add
            h.tv.get('contentBox').one('.yui3-tabview-list' ).delegate('click',record.prepend,'.j-add');
            h.tv.get('contentBox').one('.yui3-tabview-panel').delegate('click',record.append ,'.j-add');
            h.tv.get('contentBox').one('.yui3-tabview-panel').delegate('click',record.remove ,'.j-remove');
        };

        pod={
            display:{
                editor:function(e){
                    h.podInvoke=this;
                    if(!self.my.podEditor){pod.load.editor();return false;}
                    self.my.podEditor.display(e);
                },
                report:function(e){
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
                        html   :'<html><head><title>Users name</title></head><body>'+body+'</body></html>',
                        subject:'report',
                        sendTo :'joe@dargaville.net',
                        title  :'test'
                    });
                }
            },
            load:{
                editor:function(){
                    Y.use('j-pod-editor',function(Y){
                        self.my.podEditor=new Y.J.pod.editor({});
                        Y.J.whenAvailable.inDOM(self,'my.podEditor',function(){
                            self.my.podEditor.set('zIndex',cfg.zIndex+10);
                            h.podInvoke.simulate('click');
                        });
                        Y.on(self.my.podEditor.customEvent.save,function(rs){h.podInvoke.setContent(rs);});
                    });
                },
                report:function(){
                    Y.use('j-pod-report',function(Y){
                        self.my.podReport=new Y.J.pod.report({'zIndex':99999});
                        Y.J.whenAvailable.inDOM(self,'my.podReport',function(){h.podInvoke.simulate('click');});
                    });
                }
            }
        };

        populate={
            grp:function(id,o){
                var rs=Y.JSON.parse(o.responseText)[0].result,
                    sortInfo=[]
                ;
                Y.each(rs.grp.data,function(grp){
                    h.hd.one('.j-data-name').set('value',grp.name);
                    h.grp=grp;
                });
                //info
                    h.tvp.inf.set('innerHTML','');
                    //sort seq
                        Y.each(rs.info.data,function(info){sortInfo.push(info);});
                        sortInfo.sort(function(a,b){return a.seq-b.seq;});
                    Y.each(sortInfo,function(info){
                        var nn=render.info(),
                            opts=[],
                            selOpt=nn.one('>select'),
                            idx
                        ;
                        h.tvp.inf.append(nn);
                        nn.all('option').each(function(){opts.push(this.get('value'));});
                        nn.setData('data',info);
                        nn.one('.j-data-detail').set('innerHTML',info.detail);
                        idx=Y.Array.indexOf(opts,info.category);
                        if(idx===-1){
                            nn.one('.j-data-category-other').set('value',info.category);
                            selOpt.set('selectedIndex',opts.length-1);
                        }else{
                            selOpt.set('selectedIndex',idx);
                        }
                        selOpt.simulate('change');
                    });
                //tags
                    h.tvp.tag.set('innerHTML','');



                //member
                    h.tvAdm.hide();
                    Y.each(rs.member.data,function(member){
                        //logged in
                        if(J.user.usr!==undefined){

                            //current user
                            if(member.dbTable==='usr'&&member.pk===J.user.usr.id){
                                //is admin
                                Y.each(rs.role.data,function(role){
                                    if(role.member===member.id&role.name==='Admin'){h.tvAdm.show();}
                                });
                            }
                            
                        }
                    });
                    

/*
                        //grid
                            handle.grpUsrDataTable=new Y.DataTable({
                                columns:[
                                    {key:'firstName'                     ,sortable:true},
                                    {key:'lastName'                      ,sortable:true},
                                    {key:'knownAs'                       ,sortable:true},
                                    {key:'adminDate'   ,label:'admin'    ,sortable:true ,formatter:function(x){return x.value===1?'admin':'';}},
                                    {key:'memberOption',label:'member'   ,sortable:true ,allowHTML:true},
                                    {                   label:'interests'}
                                ],
                                data:recs.grpUsr
                            }).render(tv.grpUsr);
                            //listeners
                                handle.grpUsrDataTable.get('contentBox').delegate('click',function(e){
                                    //sentry
                                        if(e.target.hasClass('j-approve-pending')){return;}
                                    var rec=handle.grpUsrDataTable.getRecord(e.currentTarget.get('id')).toJSON()
                                    ;
                                    //>>>>FINISH display user

                                },'tr');
                                handle.grpUsrDataTable.get('contentBox').delegate('click',io.update.grpUsr,'.j-approve-pending');
                                handle.grpUsrDataTable.get('contentBox').delegate('click',pod.display.report,'tr');
                    //store
                        nn.grp.setData('data'  ,grp);
                        nn.grp.setData('handle',handle);
                });
*/
            }
        };

        record={
            append:function(){
                var rec=this.ancestor('.j-record'),
                    recSet=rec.ancestor('.j-dataSet').getAttribute('data-dataset')
                ;
                if(recSet==='info'){rec.insert(render.info(),'after');}
            },
            prepend:function(){
                if(this.hasClass('j-add-info')){h.tvp.inf.prepend(render.info());}
            },
            remove:function(){
                var rec=this.ancestor('.j-record'),
                    recSet=rec.ancestor('.j-dataSet'),
                    data=rec.getData('data'),
                    ids=recSet.getData('removeIds')||[]
                ;
                if(data!==undefined){
                    ids.push(data.id);
                    recSet.setData('removeIds',ids);
                }
                rec.remove();
            }
        };

        render={
            base:function(){
                h.pl=new Y.Panel({
                    headerContent:'<input type="text" class="j-data j-data-name" placeholder="team/group name" title="team/group name" />',
                    bodyContent:'',
                    modal  :true,
                    visible:true,
                    width  :800,
                    xy     :[10,20],
                    zIndex :999
                })
                .plug(Y.Plugin.Drag,{handles:['.yui3-widget-hd']})
                .plug(Y.Plugin.Resize)
                .render();
                //shortcuts
                    h.hd=h.pl.headerNode;
                    h.bd=h.pl.bodyNode;
                    h.ft=h.pl.footerNode;
                h.tv=new Y.TabView({
                    children:[
                        {label:'about '+Y.J.html('btn',{action:'add',title:'add',classes:'j-add-info'}),
                         content:'info categories and editable descriptions'},
                        {label:'tags'    ,content:
                            '<div class="j-tags-social"></div>'
                           +'<div class="j-tags-business"></div>'},
                        {label:'members' ,content:'members and their roles'},
                        {label:'projects',content:''},
                        {label:'events'  ,content:''},
                        {label:'meetings',content:''},
                        {label:'docs'    ,content:''},
                        {label:'admin'   ,content:
                            '<ul>'
                           +  '<li><button class="j-remove-grp">Remove group</button></li>'
                           +  '<li>Other actions...</li>'
                           +'<ul>'
                        }
                    ]
                }).render(h.bd);
                h.bd.append(Y.J.html('btn',{action:'save',title:'save' ,label:'save'}));
                //shortcuts
                    h.tvAdm=h.tv.item(7);
                    h.tvp={
                        inf:h.tv.item(0).get('panelNode'),
                        tag:h.tv.item(1).get('panelNode'),
                        mem:h.tv.item(2).get('panelNode'),
                        prj:h.tv.item(3).get('panelNode'),
                        evt:h.tv.item(4).get('panelNode'),
                        mtg:h.tv.item(5).get('panelNode'),
                        doc:h.tv.item(6).get('panelNode'),
                        adm:h.tv.item(7).get('panelNode')
                    };
                //init
                    h.tvp.inf.addClass('j-dataSet').setAttribute('data-dataset','info');
                    //FINISH others...
                    
            },
            info:function(){
                var nn=Y.Node.create(
                    '<div class="j-record">'
                   +  '<select class="j-data j-data-category" title="category">'
                   +    '<option>Vision</option>'
                   +    '<option>Mission</option>'
                   +    '<option>Objectives</option>'
                   +    '<option>Charter</option>'
                   +    '<option>Scope</option>'
                   +    '<option>Other</option>'
                   +  '</select>'
                   +  '<input class="j-data-category-other" type="text"><br/>'
                   +  '<textarea class="j-data j-data-detail" placeholder="details" title="details"></textarea>'
                   +  Y.J.html('btn',{action:'add'   ,title:'add record'   })
                   +  Y.J.html('btn',{action:'remove',title:'remove record'})
                   +'</div>'
                );
                nn.one('.j-data-category-other').setStyle('display','none');
                return nn;
            }
        };

        render.base();
        h.pl.get('boundingBox').addClass('j-pod-'+self.info.id);
        h.hd.set('title','pod:'+self.info.id+' '+self.info.version+' '+self.info.description);
        listeners();

    };

},'1.1 May 2014',{requires:['base','io','node']});

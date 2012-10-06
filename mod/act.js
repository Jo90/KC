/** /mod/act.js
 *
 *  Kauri Coast Promotion Society
 *
 */
YUI.add('kc-mod-act',function(Y){

    Y.namespace('KC.mod').act=function(cfg){

        if(typeof cfg==='undefined' ||
           typeof cfg.node==='undefined'
        ){alert('mod-act insuffient parameters');return;}

        cfg=Y.merge({
            title:'project/events'
        },cfg);

        this.info={
            id         :'act'
           ,title      :cfg.title
           ,description:'project/events system'
           ,file       :'/mod/act.js'
           ,version    :'v1.0 August 2012'
        };

        var self=this
           ,d={
                TG_COLLECTION_ACT:4
               ,list:{}
            }
           ,h={grid:{},list:{}}
            //functions
           ,initialise={}
           ,io={}
           ,listeners
           ,pod={}
           ,populate={}
           ,render={}
           ,sync={}
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
            sync.all();
            h.list.actTags=new Y.KC.widget.List({
                elements      :d.list.actTags
               ,selected      :[]
               ,selectorPrompt:'+Filter for '+d.tagCollection.tgCollection.name
               ,title         :'Select tags to filter activities - x removes tag'
            }).render(cfg.node.one('.kc-activityTags'));
        };

        io={
            fetch:{
                act:function(){
                    Y.io('/db/table/act/s.php',{
                        method:'POST'
                       ,on:{complete:function(id,o){Y.fire('db-act:available',Y.JSON.parse(o.responseText)[0].result);}}
                       ,data:Y.JSON.stringify([{criteria:{
                           limitOffset  :0 //>>>>FINISH
                          ,limitRowCount:parseInt(cfg.node.one('.kc-limit-rowCount').get('value'),10)
                          ,orderBy      :cfg.node.one('.kc-criteria-orderBy').get('value')
                          ,tags         :h.list.actTags.get('selected')
                        }}])
                    });
                }
            }
        };

        listeners=function(){
            h.actName.on('keyup',populate.act);
            h.caseSensitive.on('click',populate.act);
            h.filtersBtn.on('click',function(){
                if(h.filtersbb.getStyle('display')==='none'){
                    h.filtersbb.setStyle('display','');
                    this.setContent('hide advanced search');
                }else{
                    h.filtersbb.setStyle('display','none');
                    this.setContent('show advanced search');
                }
            })
            h.fetch.on('click',io.fetch.act);
            //custom
                Y.on('kc:logout'       ,trigger.loggedOut);
                Y.on('kc:logon'        ,io.fetch.act);
                Y.on('db-act:available',populate.act);
        };

        pod={
            display:{
                actEdit:function(e){
                    h.podInvoke=e.currentTarget;
                    if(!self.my.podGrpEdit){
                        pod.load.actEdit();
                        return false;
                    }
                    self.my.podGrpEdit.display({actIds:[parseInt(this.get('value'),10)]});
                }
               ,report:function(e){
                    var act
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
                    act=h.actDataTable.getRecord(e.currentTarget.get('id')).toJSON();
                    //html
                        body+='<em style="font-size:1.6em;font-weight:bold;color:#800">'+act.name+'</em>';
                        body+='<img style="position:fixed;z-index:-1;bottom:0;left:0;" src="/css/img/kauriTreeTiny.png" />';
                        body+='<img style="position:fixed;z-index:-1;bottom:0;right:0" src="/css/img/ManganuiBluffTiny.png" />';
                        body+='<p>Created: '+new Date(act.created*1000).toString()+'</p>';
                        body+='<p>Contact Details: '+(act.contactDetail===null?'not specified yet':act.contactDetail)+'</p>';
                        //tags
                            Y.each(KC.rs.actTags.data,function(actTag){
                                if(actTag.pk!==act.id){return;}
                                tags.push(KC.data.tgTag[actTag.tag].name);
                            });
                            if(tags.length>0){body+='<p>Tags: '+tags.join()+'</p>';}
                        //members
                            Y.each(KC.rs.actUsr.data,function(actUsr){
                                if(actUsr.act===act.id){
                                    x=KC.rs.usr.data[actUsr.usr];
                                    users.push(
                                        (x.knownAs!==null?x.knownAs:x.firstName)
                                    +(actUsr.admin!==null?'<em>[admin]</em>':'')
                                    +' ('+x.publicDetails+')'
                                    );
                                }
                            });
                            if(users.length>0){
                                body+='<p>Members: '+users.join()+'</p>';
                            }
                        //info
                            Y.each(KC.rs.actInfo.data,function(actInfo){
                                if(actInfo.act===act.id){
                                    body+='<em class="kc-style-light">'+actInfo.category+'</em><p class="kc-style-light">'+actInfo.info+'</p>';
                                }
                            });
                    self.my.podReport.display({
                        html   :'<html><head><title>'+act.name+'</title></head><body>'+body+'</body></html>'
                       ,subject:'report'
                       ,sendTo :'joe@dargaville.net'
                       ,title  :act.name
                    });
                }
            }
           ,load:{
                actEdit:function(){
                    Y.use('kc-pod-actEdit',function(Y){
                        self.my.podGrpEdit=new Y.KC.pod.actEdit();
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
            act:function(rs){
                KC.rs=Y.merge(KC.rs,rs);
                var records=[]
                   ,actName=h.actName.get('value')
                   ,filterChecked=h.caseSensitive.get('checked')
                   ,actNameFilter
                   ,groupName
                   ,tagFilter={
//                       social  :h.list.social  .get('selected')
                    }
                ;
                if(actName!==''){
                    actNameFilter=filterChecked
                        ?actName
                        :actName.toLowerCase();
                }
                //format data
                    Y.each(KC.rs.act.data,function(act){



                        
                        records.push(act);
                    });
                if(h.actDataTable){h.actDataTable.set('data',records);}
                else{
                    h.actDataTable=new Y.DataTable({
                        caption:'Kauri Coast Groups/Teams'
                       ,columns:[
                            {key:'name'                         ,sortable:true}
                           ,{                label:'projects'}
                           ,{                label:'meetings'}
                           ,{                label:'events'}
                        ]
                       ,data:records
                    }).render(h.grid);
                    //listeners
                        h.actDataTable.get('contentBox').delegate('click',pod.display.report,'tr');
                }
                h.actDataTable.sort('name');
            }
        };

        render={
            base:function(){
                cfg.node.setContent(
                    '<span class="kc-activityTags"></span>'
                   +' &nbsp; | sort by '
                   +'<select class="kc-criteria kc-criteria-orderBy">'
                   +  '<option value="order by 1 desc">latest</option>'
                   +  '<option value="order by 1">earliest</option>'
                   +'</select>'
                   +'&nbsp; | '
                   +Y.KC.html('btn',{action:'find',label:'fetch'})
                   +'<button style="float:right;">show advanced search</button>'
                   +'<div class="kc-display-filters">'
                   +  'name filter ('
                   +  '<label><input type="checkbox" class="kc-criteria kc-criteria-caseSensitive" />case sensitive</label>'
                   +  ') <input class="kc-data kc-data-actName" type="text" placeholder="activity/project/event" title="activity/project/event name filter" />'
                   +  '<label><input type="checkbox" />include completed</label>'
                   +  ' &nbsp; | row limit <select class="kc-limit-rowCount">'
                   +    '<option>10</option>'
                   +    '<option selected="selected">20</option>'
                   +    '<option>30</option>'
                   +    '<option>50</option>'
                   +    '<option>100</option>'
                   +'  </select>'
                   +'</div>'
                   +'<div class="kc-grid"></div>'
                );
                //shortcuts
                    h.actName      =cfg.node.one('.kc-data-actName');
                    h.caseSensitive=cfg.node.one('.kc-criteria-caseSensitive');
                    h.filtersBtn   =cfg.node.one('> button');
                    h.filtersbb    =cfg.node.one('> .kc-display-filters');
                    h.tagsProject  =h.filtersbb.one('.kc-tags-project');
                    h.fetch        =cfg.node.one('.kc-find');
                    h.grid         =cfg.node.one('.kc-grid');
            }
        };

        sync={
            all:function(){
                sync.tags();
            }
           ,tags:function(){
                var tableId=KC.data.dbTable['act'].id
                   ,actCollection=Y.KC.collection(tableId)
                ;
                d.tagCollection=actCollection[d.TG_COLLECTION_ACT]
                d.list.actTags=[];
                Y.each(d.tagCollection.tgCollectionTag,function(tgCollectionTag){
                    d.list.actTags.push({
                        name:tgCollectionTag.tgName
                       ,id  :tgCollectionTag.tag
                    });
                });
            }
        };

        trigger={
            loggedOut:function(){
                //clear result set
                if(typeof KC.rs.actUsr!=='undefined'){delete KC.rs.actUsr;}
                io.fetch.act();
            }
        };
        /**
         *  load & initialise
         */
        Y.KC.dataSet.fetch([
            ['act','id']
        ],function(){

            render.base();
            initialise();
            listeners();

        });
    };

},'1.0 June 2012',{requires:['base','io','node']});

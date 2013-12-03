/** //mod/act.js
 *
 */
YUI.add('j-mod-act',function(Y){

    Y.namespace('J.mod').act=function(cfg){

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
/*
            h.list.actTags=new Y.J.widget.List({
                elements      :d.list.actTags
               ,selected      :[]
               ,selectorPrompt:'+Filter for '+d.tagCollection.tgCollection.name
               ,title         :'Select tags to filter activities - x removes tag'
            }).render(cfg.node.one('.j-activityTags'));
*/
        };

        io={
            fetch:{
                act:function(){
                    Y.io('/db/act/s.php',{
                        method:'POST'
                       ,on:{complete:function(id,o){Y.fire('db-act:available',Y.JSON.parse(o.responseText)[0].result);}}
                       ,data:Y.JSON.stringify([{criteria:{
                           limitOffset  :0 //>>>>FINISH
                          ,limitRowCount:parseInt(cfg.node.one('.j-limit-rowCount').get('value'),10)
                          ,orderBy      :cfg.node.one('.j-criteria-orderBy').get('value')
//                          ,tags         :h.list.actTags.get('selected')
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
                Y.on('j:logout'       ,trigger.loggedOut);
                Y.on('j:logon'        ,io.fetch.act);
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
                            Y.each(J.rs.actTags.data,function(actTag){
                                if(actTag.pk!==act.id){return;}
                                tags.push(J.data.tgTag[actTag.tag].name);
                            });
                            if(tags.length>0){body+='<p>Tags: '+tags.join()+'</p>';}
                        //members
                            Y.each(J.rs.actUsr.data,function(actUsr){
                                if(actUsr.act===act.id){
                                    x=J.rs.usr.data[actUsr.usr];
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
                            Y.each(J.rs.actInfo.data,function(actInfo){
                                if(actInfo.act===act.id){
                                    body+='<em class="j-style-light">'+actInfo.category+'</em><p class="j-style-light">'+actInfo.info+'</p>';
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
                    Y.use('j-pod-actEdit',function(Y){
                        self.my.podGrpEdit=new Y.J.pod.actEdit();
                        Y.J.whenAvailable.inDOM(self,'my.podGrpEdit',function(){h.podInvoke.simulate('click');});
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
            act:function(rs){
                J.rs=Y.merge(J.rs,rs);
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
                    Y.each(J.rs.act.data,function(act){



                        
                        records.push(act);
                    });
                if(h.actDataTable){h.actDataTable.set('data',records);}
                else{
                    h.actDataTable=new Y.DataTable({
                        columns:[
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
                    'Kauri Coast Groups/Teams <span class="j-activityTags"></span>'
                   +'&nbsp; sort by '
                   +'<select class="j-criteria j-criteria-orderBy">'
                   +  '<option value="order by 1 desc">latest</option>'
                   +  '<option value="order by 1">earliest</option>'
                   +'</select>'
                   +'&nbsp; | '
                   +Y.J.html('btn',{action:'find',label:'fetch'})
                   +'<button style="float:right;">show advanced search</button>'
                   +'<div class="j-display-filters">'
                   +  'name filter ('
                   +  '<label><input type="checkbox" class="j-criteria j-criteria-caseSensitive" />case sensitive</label>'
                   +  ') <input class="j-data j-data-actName" type="text" placeholder="activity/project/event" title="activity/project/event name filter" />'
                   +  '<label><input type="checkbox" />include completed</label>'
                   +  ' &nbsp; | row limit <select class="j-limit-rowCount">'
                   +    '<option>10</option>'
                   +    '<option selected="selected">20</option>'
                   +    '<option>30</option>'
                   +    '<option>50</option>'
                   +    '<option>100</option>'
                   +'  </select>'
                   +'</div>'
                   +'<div class="j-grid"></div>'
                );
                //shortcuts
                    h.actName      =cfg.node.one('.j-data-actName');
                    h.caseSensitive=cfg.node.one('.j-criteria-caseSensitive');
                    h.filtersBtn   =cfg.node.one('> button');
                    h.filtersbb    =cfg.node.one('> .j-display-filters');
                    h.tagsProject  =h.filtersbb.one('.j-tags-project');
                    h.fetch        =cfg.node.one('.j-find');
                    h.grid         =cfg.node.one('.j-grid');
            }
        };

        trigger={
            loggedOut:function(){
                //clear result set
                if(typeof J.rs.actUsr!=='undefined'){delete J.rs.actUsr;}
                io.fetch.act();
            }
        };
        /**
         *  load & initialise
         */
        Y.J.dataSet.fetch([
            ['act','id']
        ],function(){

            render.base();
            initialise();
            listeners();

        });
    };

},'1.0 June 2012',{requires:['base','io','node']});

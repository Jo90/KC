/** /pod/info.js
 *
 *  Kauri Coast Promotion Society
 *
 */
YUI.add('kc-pod-info',function(Y){

    Y.namespace('KC.pod').info=function(cfg){

        if(typeof cfg==='undefined'
        ){cfg={};}

        //YUI ATTRS, convert pod to widget and data bind cfg attribute changes
        cfg=Y.merge({
            title                 :'information/categories'
           ,addUserDefinedCategory:true
           ,predefinedCategories  :[]
           ,existingCategories    :[]
           ,visible               :false
           ,width                 :1000
           ,xy                    :[10,50]
           ,zIndex                :99999
        },cfg);

        this.info={
            id         :'info'
           ,title      :cfg.title
           ,description:'information category'
           ,version    :'v1.0 September 2012'
        };

        var self=this
           ,d={
                list:{}
               ,pod:{}
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
           ,sync={}
           ,trigger={}
        ;

        this.customEvent={
            save:self.info.id+(++KC.env.customEventSequence)+':save'
        };

        this.display=function(p){
            d.pod=Y.merge(d.pod,p);
            h.infoList.setContent('');
            h.infoDetail.setContent('');
            h.mask=Y.KC.widget.dialogMask.mask(h.ol.get('zIndex'));
            h.ol.show();
            io.fetch.info();
        };

        this.get=function(what){
            if(what==='zIndex'){return h.ol.get('zIndex');}
        };
        this.set=function(what,value){
            if(what==='zIndex'){h.ol.set('zIndex',value);}
            if(what==='cfg'){
                if(typeof value.addUserDefinedCategory!=='undefined'){
                    cfg.addUserDefinedCategory=value;
                    sync.categoryOptions();
                }
                if(typeof value.predefinedCategories!=='undefined'){
                    cfg.predefinedCategories=value;
                    sync.categoryOptions();
                }
                cfg=Y.merge(cfg,value);
            }
        };

        this.my={}; //children

        /**
         * private
         */

        initialise=function(){
            h.bb.addClass('kc-pod-'+self.info.id);
            new Y.DD.Drag({node:h.bb,handles:[h.hd,h.ft]});
            sync.categoryOptions();
        };

        io={
            fetch:{
                info:function(){
                    Y.io('/db/table/info/s.php',{
                        method:'POST'
                       ,on:{complete:function(id,o){Y.fire('db-info:available',Y.JSON.parse(o.responseText)[0].result);}}
                       ,data:Y.JSON.stringify([{criteria:d.pod}])
                    });
                }
            }
           ,update:{
                info:function(){
                    var post=[]
                    ;
                    h.infoList.all('>.kc-record').each(function(infoList,idx){
                        var infoDetail=infoList.getData('relatedNode')
                           ,infoData  =infoDetail.getData('data')
                           ,data={
                                dbTable     :d.pod.dbTable
                               ,pk          :d.pod.pk
                               ,displayOrder:idx
                               ,viewable    :parseInt(infoDetail.one('.kc-data-viewable').get('value'),10)
                               ,category    :infoList.one('.kc-data-category').get('value')
                               ,detail      :infoDetail.one('.kc-data-detail').get('innerHTML')
                            }
                        ;
                        if(infoData){data.id=infoData.id;}
                        post.push({
                            data:data
                           ,remove:infoDetail.one('.kc-remove').get('checked')
                        });
                    });
                    Y.io('/db/table/info/u.php',{
                        method:'POST'
                       ,on:{complete:io.fetch.info}
                       ,data:Y.JSON.stringify([{criteria:{info:post}}])
                    });
                }
            }
        };

        listeners=function(){
            h.addCategory.on('change',trigger.addCategoryOption);
            h.close.on('click',trigger.close);
            //group info
                h.infoList.delegate('click',trigger.recordFocus,'>li');
                h.infoDetail.delegate('click',function(){
                    var rec=this.ancestor('.kc-record')
                    ;
                    cfg.existingCategories.splice(cfg.existingCategories.indexOf(rec.one('legend>em').get('innerHTML')),1);
                    sync.categoryOptions();
                    rec.getData('relatedNode').remove();
                    rec.remove();
                },'a.kc-remove-info');
                h.infoDetail.delegate('change',function(){
                    this.ancestor('.kc-record-info').all('>div').setStyle('display',this.get('checked')?'none':'');
                },'> legend .kc-remove');
            h.bd.delegate('click',pod.display.editor,'.kc-editor');
            h.save.on('click',io.update.info);
            //custom
                Y.on('db-info:available',populate.info);
        };

        pod={
            display:{
                editor:function(e){
                    h.podInvoke=this;
                    if(!self.my.podEditor){pod.load.editor();return false;}
                    self.my.podEditor.display(e);
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
            }
        };

        populate={
            info:function(rs){
                var defaultCategory
                ;
                KC.rs=Y.merge(KC.rs,rs);
                cfg.existingCategories=[];
                h.infoList.setContent('');
                h.infoDetail.setContent('');
                Y.each(KC.rs.info.data,function(info){
                    var nn=render.info()
                    ;
                    nn.detail.setData('data',info);
                    Y.KC.removeOption(nn.detail.one('legend'));
                    nn.list  .one('.kc-data-category').set('value',info.category);
                    nn.detail.one('legend > em'      ).setContent(info.category);
                    nn.detail.one('.kc-data-viewable').set('value',info.viewable);
                    nn.detail.one('.kc-data-detail'  ).setContent(info.detail);
                    cfg.existingCategories.push(info.category);
                    nn.detail.setData('data',info);
                    if(info.category===d.pod.category){defaultCategory=nn.list.one('.kc-data-category');}
                    nn.detail.hide();
                });
                if(defaultCategory){defaultCategory.simulate('click');}
                sync.categoryOptions();
            }
        };

        render={
            base:function(){
                h.ol=new Y.Overlay({
                    headerContent:
                        '<span title="pod:'+self.info.id+' '+self.info.version+' '+self.info.description+' &copy;KCPS">'+self.info.title+'</span> '
                       +'<select></select>'
                       +Y.KC.html('btn',{action:'close',title:'close pod'})
                   ,bodyContent:
                        '<ul class="kc-info-list"></ul>'
                       +'<ul class="kc-info-detail"></ul>'
                   ,footerContent:
                        Y.KC.html('btn',{action:'save',title:'save' ,label:'save'})
                   ,visible:cfg.visible
                   ,width  :cfg.width
                   ,xy     :cfg.xy
                   ,zIndex :cfg.zIndex
                }).plug(Y.Plugin.Resize).render();
                //shortcuts
                    h.hd         =h.ol.headerNode;
                    h.bd         =h.ol.bodyNode;
                    h.ft         =h.ol.footerNode;
                    h.bb         =h.ol.get('boundingBox');
                    h.addCategory=h.hd.one('select');
                    h.close      =h.hd.one('.kc-close');
                    h.infoList   =h.bd.one('.kc-info-list');
                    h.infoDetail =h.bd.one('.kc-info-detail');
                    h.save       =h.ft.one('.kc-save');
                //sortable
                    h.infoListSortable=new Y.Sortable({
                        container:h.infoList
                       ,nodes    :'li'
                       ,opacity  :'.1'
                    });
            }
           ,info:function(){
                var list=Y.Node.create(
                        '<li class="kc-record kc-btn kc-vert">'
                       +  '<em></em><input class="kc-data-category" title="category name" />' //em drag icon
                       +'</li>'
                    )
                   ,detail=Y.Node.create(
                        '<fieldset class="kc-record">'
                       +  '<legend><em title="original category name"></em> '
                       +    '<select class="kc-data-viewable">'
                       +      '<option value="0">Public view</option>'
                       +      '<option value="1">Group member view</option>'
                       +    '</select>'
                       +    Y.KC.html('btn',{action:'remove',classes:'kc-remove-info'})
                       +  '</legend>'
                       +  '<span class="kc-data-detail kc-editor">description goes here</span>'
                       +'</fieldset>'
                    )
                ;
                h.infoList.append(list);
                h.infoDetail.append(detail);
                list.setData('relatedNode',detail);
                detail.setData('relatedNode',list);
                return {list:list,detail:detail};
            }
        };

        sync={
            categoryOptions:function(){
                var optGroup
                   ,unusedOpts=[]
                ;
                h.addCategory.setContent('<option>+new category...</option>');
                if(cfg.addUserDefinedCategory){
                    h.addCategory.append('<option>user defined</option>');
                }
                if(cfg.predefinedCategories.length>0){
                    //any unused predefined categories
                        unusedOpts=Y.Array.filter(cfg.predefinedCategories,function(category){
                            return Y.Array.indexOf(cfg.existingCategories,category)===-1;
                        });
                    if(unusedOpts.length>0){
                        optGroup=Y.Node.create('<optgroup label="Predefined"></optgroup>');
                        h.addCategory.append(optGroup);
                        Y.each(cfg.predefinedCategories,function(category){
                            if(Y.Array.indexOf(cfg.existingCategories,category)===-1){
                                optGroup.append('<option>'+category+'</option>');
                            }
                        });
                    }
                }
            }
        };

        trigger={
            addCategoryOption:function(){
                var idx=this.get('selectedIndex')
                   ,newCategory=''
                   ,nn
                ;
                if(idx===0){return;}
                if(idx===1){
                    newCategory=prompt('Specify new category');
                    if(newCategory===null){this.set('selectedIndex',0);return;}
                }
                if(idx>1){newCategory=this.get('value');}
                cfg.existingCategories.push(newCategory);
                sync.categoryOptions();
                nn=render.info();
                nn.list.one('.kc-data-category').set('value',newCategory);
                nn.detail.one('legend em').setContent(newCategory);
                nn.list.one('input').simulate('click');
            }
           ,close:function(){
                h.ol.hide();
                Y.KC.widget.dialogMask.hide();
            }
           ,recordFocus:function(e){
                var detailNode=this.getData('relatedNode')
                ;
                this.get('parentNode').all('.kc-record-focus').removeClass('kc-record-focus');
                this.addClass('kc-record-focus');
                detailNode.get('parentNode').all('>fieldset').setStyle('display','none');
                detailNode.setStyle('display','');
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
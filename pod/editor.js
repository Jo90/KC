/** /pod/editor.js
 *
 *  Kauri Coast Promotion Society
 *
 */
YUI.add('kc-pod-editor',function(Y){

    Y.namespace('KC.pod').editor=function(cfg){

        if(typeof cfg==='undefined' ||
           typeof cfg.node==='undefined'){cfg={};}

        cfg=Y.merge({
            centered:true
           ,title   :'Editor'
           ,type    :'Template'
           ,visible :true
           ,width   :'1024px'
           ,XY      :[10,20]
           ,zIndex  :99999
        },cfg);

        this.info={
            id         :'pod-editor'
           ,title      :cfg.title
           ,description:'template editor'
           ,version    :'v1.0 August 2012'
        };

        var self=this
           ,d={}
           ,h={}
            //functions
           ,initialise
           ,listeners
           ,render={}
           ,trigger={}
        ;
 
        this.customEvent={
            save:self.info.id+(++KC.env.customEventSequence)+':save'
        };

        this.get=function(what){
            if(what==='editor'){return h.editor;}
            if(what==='node'  ){return h.ol;}
            if(what==='zIndex'){return h.ol.get('zIndex');}
        };
        this.set=function(what,value){
            if(what==='zIndex' ){h.ol.set('zIndex',value);}
        };

        this.display=function(e){
            Y.KC.widget.dialogMask.mask(h.ol.get('zIndex'));
            h.ol.show();
            h.editor.setData(e.currentTarget.get('innerHTML'));
        };

        /**
         * private
         */

        initialise=function(){
            h.bb.addClass('kc-'+self.info.id);
            new Y.DD.Drag({node:h.bb,handles:[h.hd]});
            h.bd.set('id','kc-pod-ckeditor');
            h.editor=CKEDITOR.appendTo('kc-pod-ckeditor',{},'');
        };

        listeners=function(){
            h.close.on('click',trigger.close);
            h.save.on('click',function(){
                Y.fire(self.customEvent.save,h.editor.getData());
                trigger.close();
            });
        };

        render={
            base:function(){
                h.ol=new Y.Overlay({
                    headerContent:
                        '<strong title="pod: &copy;KCPS">'+self.info.title+'</strong> '
                       +Y.KC.html('btn',{action:'close',title:'close pod'})
                   ,bodyContent  :''
                   ,footerContent:Y.KC.html('btn',{action:'save'})
                   ,centered:cfg.centered
                   ,visible :cfg.visible
                   ,width   :cfg.width
                   ,zIndex  :cfg.zIndex
                }).render(cfg.node);
                //shortcuts
                h.hd      =h.ol.headerNode;
                h.bd      =h.ol.bodyNode;
                h.ft      =h.ol.footerNode;
                h.bb      =h.ol.get('boundingBox');
                h.close   =h.hd.one('.kc-close');
                h.save    =h.ft.one('.kc-save');
            }
        };

        trigger={
            close:function(){
                h.ol.hide();
                Y.KC.widget.dialogMask.hide();
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
},'1.0 Aug 2012',{requires:['base','io','node']});
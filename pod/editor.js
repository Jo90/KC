/** //pod/editor.js
 *
 */
YUI.add('j-pod-editor',function(Y){

    Y.namespace('J.pod').editor=function(cfg){

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
            save:self.info.id+(++J.env.customEventSequence)+':save'
        };

        this.get=function(what){
            if(what==='editor'){return h.editor;}
            if(what==='node'  ){return h.pl;}
            if(what==='zIndex'){return h.pl.get('zIndex');}
        };
        this.set=function(what,value){
            if(what==='zIndex' ){h.pl.set('zIndex',value);}
        };

        this.display=function(e){
            h.pl.show();
            h.editor.setData(e.currentTarget.get('innerHTML'));
        };

        /**
         * private
         */

        initialise=function(){
            h.bb.addClass('j-'+self.info.id);
            new Y.DD.Drag({node:h.bb,handles:[h.hd]});
            h.bd.set('id','j-pod-ckeditor');
            h.editor=CKEDITOR.appendTo('j-pod-ckeditor',{},'');
        };

        listeners=function(){
            h.save.on('click',function(){
                Y.fire(self.customEvent.save,h.editor.getData());
            });
        };

        render={
            base:function(){
                h.pl=new Y.Panel({
                    headerContent:
                        '<strong title="pod: &copy;JPS">'+self.info.title+'</strong> ',
                    bodyContent  :'',
                    footerContent:Y.J.html('btn',{action:'save'}),
                    centered:cfg.centered,
                    visible :cfg.visible,
                    width   :cfg.width,
                    zIndex  :cfg.zIndex
                }).render(cfg.node);
                //shortcuts
                h.hd  =h.pl.headerNode;
                h.bd  =h.pl.bodyNode;
                h.ft  =h.pl.footerNode;
                h.bb  =h.pl.get('boundingBox');
                h.save=h.ft.one('.j-save');
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

        });
    };
},'1.0 Aug 2012',{requires:['base','io','node']});

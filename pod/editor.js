//pod/editor.js

YUI.add('j-pod-editor',function(Y){
    'use strict';
    Y.namespace('J.pod').editor=function(cfg){

        cfg=Y.merge({
            centered:true,
            title   :'Editor',
            type    :'Template',
            width   :'1024px',
            XY      :[10,20]
        },cfg);

        this.info={
            id         :'pod-editor',
            title      :cfg.title,
            description:'template editor',
            version    :'v1.0 August 2012'
        };

        var self=this,
            h={}
        ;
 
        this.get=function(what){
            if(what==='editor'){return h.editor;}
            if(what==='node'  ){return h.pl;}
        };
        this.set=function(what,value){
            if(what==='zIndex' ){h.pl.set('zIndex',value);}
        };

        this.display=function(e){
            h.target=this;
            h.pl.show();
            h.editor.setData(e.currentTarget.get('innerHTML'));
        };

        h.pl=new Y.Panel({
            headerContent:'<strong title="pod: &copy;JPS">'+self.info.title+'</strong> ',
            bodyContent  :'',
            footerContent:Y.J.html('btn',{action:'save'}),
            centered:cfg.centered,
            width   :cfg.width,
            zIndex  :999999
        }).render();

        //shortcuts
            h.hd  =h.pl.headerNode;
            h.bd  =h.pl.bodyNode;
            h.ft  =h.pl.footerNode;
            h.bb  =h.pl.get('boundingBox');

        h.bb.addClass('j-'+self.info.id);
        h.bd.set('id','j-pod-ckeditor');
        h.editor=CKEDITOR.appendTo('j-pod-ckeditor',{},'');

        h.ft.one('.j-save').on('click',function(){h.target.set('innerHTML',h.editor.getData());});

    };
},'1.0 Aug 2012',{requires:['base','io','node']});

/** //pod/report.js
 *
 */
YUI.add('j-pod-report',function(Y){

    Y.namespace('J.pod').report=function(cfg){

        if(typeof cfg==='undefined'
        ){alert('insufficient parameters');return;}

        cfg=Y.merge({
            title   :'Report'
           ,centered:true
           ,width   :'860px'
           ,zIndex  :999
        },cfg);

        this.info={
            id         :'report',
            title      :cfg.title,
            description:'report print/email',
            version    :'v1.0 September 2012'
        };

        var self=this,
            d={
                list:{},
                pod :{},
                rs  :{}
            },
            h={},
            //functions
            initialise,
            io={},
            listeners,
            populate={},
            render={}
        ;

        this.display=function(p){
            var frameDoc=h.dframe.contentDocument||h.dframe.contentWindow.document;
            d.pod=Y.merge(d.pod,p);
            if(typeof p.title!=='undefined'){h.title.setContent(p.title);}
            h.pl.show();
            frameDoc.open();
            frameDoc.write(p.html);
            frameDoc.close();
        };

        this.get=function(what){
            if(what==='zIndex'){return h.pl.get('zIndex');}
        };
        this.set=function(what,value){
            if(what==='zIndex'){h.pl.set('zIndex',value);}
            if(what==='cfg'){cfg=Y.merge(cfg,value);}
        };

        this.my={}; //children

        /**
         * private
         */

        initialise=function(){
            h.bb.addClass('j-pod-'+self.info.id);
            new Y.DD.Drag({node:h.bb,handles:[h.hd,h.ft]});
        };

        io={
            send:{
               email:function(){
                    Y.io('/db/app/email.php',{
                        method:'POST',
                        headers:{'Content-Type':'application/json'},
                        on:{complete:function(){alert('to do: trigger close panel');}},
                        data:Y.JSON.stringify([{
                           criteria:{
                               email  :'jfdouglas2004@yahoo.com.au',
                               message:h.dframeDoc.body.innerHTML,
                               subject:'Wiseberry Listing Pack'
                            }
                        }])
                    });
                }
            }
        };

        listeners=function(){
            h.email.on('click',io.send.email);
            //>>>>FINISH print xbrowser?
            h.print.on('click',function(){h.dframe.contentWindow.print();return false;});
        };

        render={
            base:function(){
                h.pl=new Y.Panel({
                    headerContent:
                        '<strong title="pod:'+self.info.id+' '+self.info.version+' '+self.info.description+' &copy;JPS"><em>'+self.info.title+'</em></strong> '
                       //>>>>FINISH
                       +'<input type="text" placeholder="email address" title="email address" >'
                       +'<button class="j-email">Email</button>'
                       +'<button class="j-print">Print</button>',
                    bodyContent:'',
                    align :{points:[Y.WidgetPositionAlign.TC,Y.WidgetPositionAlign.TC]},
                    modal :true,
                    width :cfg.width,
                    zIndex:cfg.zIndex
                }).render();
                //resize
                    h.pl.plug(Y.Plugin.Resize);
                    h.pl.resize.on('resize:end',function(e){
                        h.dframe.width =h.bd.getStyle('width');
                        h.dframe.height=h.bd.getStyle('height');
                    });
                //shortcuts
                    h.hd    =h.pl.headerNode;
                    h.bd    =h.pl.bodyNode;
                    h.bb    =h.pl.get('boundingBox');
                    h.title =h.hd.one('em');
                    h.email =h.hd.one('.j-email');
                    h.print =h.hd.one('.j-print');

                    h.dframe       =document.createElement('iframe');
                    h.dframe.id    ='j-displayFrame';
                    h.dframe.width =800;
                    h.dframe.height=600;
                    h.dframe.src   ='about:blank';
                    h.bd.appendChild(h.dframe);
                    h.dframeDoc    =h.dframe.contentDocument||h.dframe.contentWindow.document;
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

},'1.0 September 2012',{requires:['base','io','node']});

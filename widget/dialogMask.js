/** /widget/dialogMask.js
 *
 *  Kauri Coast Promotion Society
 *
 *  adds to body
 *      <iframe id="kc-dialogMask">
 *
 *  concept
 *      When the mask is invoked, the invoking object needs to set it's z-index high enough to ensure it is to the front.
 *      The mask z-index is set to the objects z-index less 1
 *      The mask z-index is placed on the stack
 *      When hide is invoked the mask is moved to the previous z-index on the stack
 *      Or if the stack is empty the mask is hidden.
 *
 */
YUI.add('kc-widget-dialogMask',function(Y){

    Y.namespace('KC.widget').dialogMask={
        //data
        iframeMask:''
       ,stack:[] //used z-indexes
       ,hide:function(){
            var zIndex=-1;
            this.stack.pop();
            if(this.stack.length>0){zIndex=this.stack[this.stack.length-1];}
            this.iframeMask.setStyle('zIndex',zIndex);
        }
       ,init:function(zIndex){
            if(!Y.one('#kc-dialogMask')){
                //create iframeMask
                    this.iframeMask=Y.Node.create('<iframe id="kc-dialogMask"></div>');
                    Y.one('body').append(this.iframeMask);
                //style
                    this.iframeMask.setStyles({zIndex:zIndex});
                    this.sizeToScreen();
                //listen for window.resize
                    Y.one('window').on('resize',this.sizeToScreen);
            }
        }
       ,sizeToScreen:function(){
            var dsh=document.documentElement.scrollHeight
               ,dch=document.documentElement.clientHeight
               ,dsw=document.documentElement.scrollWidth
               ,dcw=document.documentElement.clientWidth
               ,bdh=(dsh>dch)?dsh:dch
               ,bdw=(dsw>dcw)?dsw:dcw
            ;
            Y.KC.widget.dialogMask.iframeMask.setStyles({
                height:bdh+'px'
               ,width:bdw+'px'
            });
        }
       ,mask:function(zIndex){
            this.init(zIndex-1); //ensure iframeMask exists
            this.stack.push(zIndex-1);
            this.iframeMask.setStyles({zIndex:zIndex-1});
            return this.stack.length; //allow invocator to track level
        }
    };

},'1.1 Jan 2012',{requires:['base','node']});
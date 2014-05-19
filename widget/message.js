//widget/message.js

YUI().add('j-widget-message',function(Y){

    var Message=function(config){
        Message.superclass.constructor.apply(this,arguments);
    };

    Message.NAME='message';

    Message.ATTRS={
        message:{
            setter:function(msg){
                var pl=this.get('pl')
                ;
                pl.set('centered',true);
                pl.set('visible',msg!=='');
                pl.bodyNode.setContent(msg);
            }
           ,value:'loading'
        },
        pl:{
            value:new Y.Panel({
                bodyContent:'loading....',
                visible:false,
                zIndex :999999
            }).render()
        }
    };

    Y.extend(Message,Y.Widget,{
        initializer:function(config){
            this.get('pl').get('contentBox').addClass('j-message');
        }
    });

    Y.namespace('J.widget').Message=Message;

    Y.J.widget.busy=new Y.J.widget.Message();

},"1.0",{ requires:['panel','widget']});

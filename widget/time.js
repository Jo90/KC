/** /widget/time.js
 *
 *  Kauri Coast Promotion Scoiety
 *
 */
YUI.add('kc-widget-time',function(Y){

    var DEFAULT_DATE_FORMAT='h:mmtt';

    Y.one('body').append('<div id="kc-time-container"><div id="kc-time"></div></div>');

    Y.namespace('KC.widget').time=new Y.Overlay({
        bodyContent:
            '<select class="kc-time-hour">'
           +  '<option>1</option>'
           +  '<option>2</option>'
           +  '<option>3</option>'
           +  '<option>4</option>'
           +  '<option>5</option>'
           +  '<option>6</option>'
           +  '<option>7</option>'
           +  '<option>8</option>'
           +  '<option>9</option>'
           +  '<option>10</option>'
           +  '<option>11</option>'
           +  '<option>12</option>'
           +'</select>'
           +'<select class="kc-time-minute">'
           +  '<option>00</option>'
           +  '<option>05</option>'
           +  '<option>10</option>'
           +  '<option>15</option>'
           +  '<option>20</option>'
           +  '<option>25</option>'
           +  '<option>30</option>'
           +  '<option>35</option>'
           +  '<option>40</option>'
           +  '<option>45</option>'
           +  '<option>50</option>'
           +  '<option>55</option>'
           +'</select>'
           +'<select class="kc-time-ampm">'
           +  '<option>am</option>'
           +  '<option>pm</option>'
           +'</select>'
           +Y.KC.html('btn',{action:'close'})
       ,width:'350px'
       ,visible:false
       ,zIndex:99999
    }).render('#kc-time');
    Y.KC.widget.time.KC={
        callingNode:null
    };

    Y.KC.widget.time.get('boundingBox').delegate('change',function(e){
        var bb=Y.KC.widget.time.get('boundingBox')
        ;
        Y.KC.widget.time.KC.callingNode.set('value',
            bb.one('.kc-time-hour').get('value')+':'
           +bb.one('.kc-time-minute').get('value')
           +bb.one('.kc-time-ampm').get('value')
        );
    },'select');

    Y.KC.widget.time.get('boundingBox').one('.kc-close').on('click',function(e){
        Y.KC.widget.time.hide();
    });

    Y.one('body').delegate('focus',function(){
        var time=this.get('value')
           ,timePattern=/^(\d{1,2}):(\d{2})(:(\d{2}))?(\s?(AM|am|PM|pm))?$/
           ,timeArray=time.match(timePattern)
           ,ol=Y.KC.widget.time
           ,bb=Y.KC.widget.time.get('boundingBox')
        ;
        ol.KC.callingNode=this;
        //set hour,minute,ampm
            Y.KC.pod.fn.dom.matchSelect(bb.one('.kc-time-hour'  ),timeArray[1]);
            Y.KC.pod.fn.dom.matchSelect(bb.one('.kc-time-minute'),timeArray[2]);
            Y.KC.pod.fn.dom.matchSelect(bb.one('.kc-time-ampm'  ),timeArray[6].toLowerCase());
        ol.show();
        ol.get('boundingBox').setXY([this.getX()+2,this.getY()+26]);
    },'.kc-time');

    Y.one('body').delegate('blur',function(){
        var time=this.get('value')
        ;
        if(time!=='' && !Y.KC.isValidTime(time)){
            alert('time format not recognised');
            return false;
        }
    },'.kc-time');

    //hide
        //stop time events from bubbling outside container
        Y.one('#kc-time-container').on('click',function(e){
            e.stopPropagation();
        });
        Y.one('body').on('click',function(e){
            if(!e.target.hasClass('kc-time')){
                Y.KC.widget.time.hide();
            }
        });

},'January 2012',{requires:['base','node']});

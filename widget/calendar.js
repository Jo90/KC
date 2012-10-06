/** /widget/calendar.js
 *
 *  Kauri Coast Promotion Society
 *
 */
YUI.add('kc-widget-calendar',function(Y){

    var DEFAULT_DATE_FORMAT='d MMM yyyy';

    Y.one('body').addClass('yui3-skin-sam');
    Y.one('body').append('<div id="kc-calendar-container"><div id="kc-calendar"></div></div>');

    Y.namespace('KC.widget').calendar=new Y.Calendar({
        contentBox:'#kc-calendar'
       ,date:new Date()
       ,showNextMonth:true
       ,showPrevMonth:true
       ,width:'350px'
       ,visible:false
    }).render();
    Y.KC.widget.calendar.KC={
        callingNode:null
       ,settingFocus:false
    };

    Y.KC.widget.calendar.after('selectionChange',function(e){
        var date_format=DEFAULT_DATE_FORMAT
           ,callingNode=Y.KC.widget.calendar.KC.callingNode
           ,cfg=callingNode.getData('calendar') //use configuration if defined
        ;
        //sentry
            if(e.newSelection.length===0 || //deselect also triggers selectionChange
                Y.KC.widget.calendar.KC.settingFocus){return;}
        //check configuration
            if(cfg && cfg.date_format){
                date_format=cfg.date_format;
            }
        Y.KC.widget.calendar.hide();
        callingNode.set('value',(new Date(e.newSelection[0])).toString(date_format));
    });

    Y.one('body').delegate('focus',function(){
        var thisValue=this.get('value')
           ,nodeDate=thisValue===''
                ?new Date().set({hour:0,minute:0,second:0,millisecond:0})
                :new Date(thisValue)
           ,nodeMonth=new Date(nodeDate).set({day:1,hour:0})
           ,cal=Y.KC.widget.calendar
           ,calMonth=new Date(cal.get('date')).set({hour:0})
           ,compareCalAndNodeMonth=Date.compare(calMonth,nodeMonth)
        ;
        cal.KC.callingNode=this;
        cal.KC.settingFocus=true;
        cal.show();
        cal.get('boundingBox').setXY([this.getX()+2,this.getY()+26]);
        cal.deselectDates(); //causes selectionChange to fire
        //if different month
            if(compareCalAndNodeMonth!==0){ //equal returns 0
                Y.KC.widget.calendar.set('date',nodeMonth);
            }
        cal.selectDates(nodeDate); //causes selectionChange to fire
        cal.KC.settingFocus=false;
    },'.kc-date');

    //hide
        Y.one('body').delegate('focus',function(e){
            Y.KC.widget.calendar.hide();
        },':not(.kc-date)');
        //stop calendar events from bubbling outside container
        Y.one('#kc-calendar-container').on('click',function(e){
            e.stopPropagation();
        });
        Y.one('body').on('click',function(e){
            if(!e.target.hasClass('kc-date')){
                Y.KC.widget.calendar.hide();
            }
        });

},'August 2011',{requires:['base','calendar','node']});

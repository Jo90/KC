/** /widget/calendar.js
 *
 *  Kauri Coast Promotion Society
 *
 */
YUI.add('j-widget-calendar',function(Y){

    var DEFAULT_DATE_FORMAT='d MMM yyyy';

    Y.one('body').addClass('yui3-skin-sam');
    Y.one('body').append('<div id="j-calendar-container"><div id="j-calendar"></div></div>');

    Y.namespace('J.widget').calendar=new Y.Calendar({
        contentBox:'#j-calendar'
       ,date:new Date()
       ,showNextMonth:true
       ,showPrevMonth:true
       ,width:'350px'
       ,visible:false
    }).render();
    Y.J.widget.calendar.J={
        callingNode:null
       ,settingFocus:false
    };

    Y.J.widget.calendar.after('selectionChange',function(e){
        var date_format=DEFAULT_DATE_FORMAT
           ,callingNode=Y.J.widget.calendar.J.callingNode
           ,cfg=callingNode.getData('calendar') //use configuration if defined
        ;
        //sentry
            if(e.newSelection.length===0 || //deselect also triggers selectionChange
                Y.J.widget.calendar.J.settingFocus){return;}
        //check configuration
            if(cfg && cfg.date_format){
                date_format=cfg.date_format;
            }
        Y.J.widget.calendar.hide();
        callingNode.set('value',(new Date(e.newSelection[0])).toString(date_format));
    });

    Y.one('body').delegate('focus',function(){
        var thisValue=this.get('value')
           ,nodeDate=thisValue===''
                ?new Date().set({hour:0,minute:0,second:0,millisecond:0})
                :new Date(thisValue)
           ,nodeMonth=new Date(nodeDate).set({day:1,hour:0})
           ,cal=Y.J.widget.calendar
           ,calMonth=new Date(cal.get('date')).set({hour:0})
           ,compareCalAndNodeMonth=Date.compare(calMonth,nodeMonth)
        ;
        cal.J.callingNode=this;
        cal.J.settingFocus=true;
        cal.show();
        cal.get('boundingBox').setXY([this.getX()+2,this.getY()+26]);
        cal.deselectDates(); //causes selectionChange to fire
        //if different month
            if(compareCalAndNodeMonth!==0){ //equal returns 0
                Y.J.widget.calendar.set('date',nodeMonth);
            }
        cal.selectDates(nodeDate); //causes selectionChange to fire
        cal.J.settingFocus=false;
    },'.j-date');

    //hide
        Y.one('body').delegate('focus',function(e){
            Y.J.widget.calendar.hide();
        },':not(.j-date)');
        //stop calendar events from bubbling outside container
        Y.one('#j-calendar-container').on('click',function(e){
            e.stopPropagation();
        });
        Y.one('body').on('click',function(e){
            if(!e.target.hasClass('j-date')){
                Y.J.widget.calendar.hide();
            }
        });

},'August 2011',{requires:['base','calendar','node']});

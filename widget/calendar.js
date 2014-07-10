//widget/calendar.js

YUI.add('j-widget-calendar',function(Y){
    'use strict';

    var pl=new Y.Panel({
            headerContent:
                '<button class="j-calendar-today" title="return to or set as today">today</button>'
               +'<button class="j-calendar-clear" title="clear date field">clear</button>'
               +'<select class="j-widget-calendar-hour">'
               +  '<option value="0">midnight</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option selected="selected">9</option><option>10</option><option>11</option>'
               +'</select>'
               +':<select class="j-widget-calendar-minute">'
               +  '<option>00</option><option>05</option><option>10</option><option>15</option><option>20</option><option>25</option><option>30</option><option>35</option><option>40</option><option>45</option><option>50</option><option>55</option>'
               +'</select>'
               +'<select class="j-widget-calendar-ampm">'
               +  '<option selected="selected">am</option>'
               +  '<option>pm</option>'
               +'</select>',
            bodyContent:'',
            visible :false,
            zIndex  :999999
        }).plug(Y.Plugin.Drag,{handles:['.yui3-widget-hd']}).render(),

        cal=new Y.Calendar({
            contentBox:'#j-calendar',
            date:new Date(),
            showNextMonth:true,
            showPrevMonth:true
        }).render(pl.bodyNode),

        callingNode,
        fmt='DDMMMYY h:mma',
        f={
            hr :pl.headerNode.one('.j-widget-calendar-hour'),
            min:pl.headerNode.one('.j-widget-calendar-minute'),
            am :pl.headerNode.one('.j-widget-calendar-ampm'),
            hr0:pl.headerNode.one('.j-widget-calendar-hour').one('option')
        },
        setCallingNode=function(value){
            if(value.type!==undefined){value='';}
            callingNode.set('value',value);
            callingNode.simulate('change');
        },
        setFirstHourAsNoonOrMidnight=function(){
            f.hr0.set('innerHTML',f.am.get('value')==='am'?'midnight':'noon');
        }
    ;

    Y.one('.j-calendar-today').on('click',function(){
        //if not today set calendar to today, if today set calling node
        if(moment(cal.get('selectedDates')[0]).format('DDMMYY')===moment(new Date()).format('DDMMYY')){
            cal.fire('dateClick');
        }else{
            cal.set('date',new Date());
            cal.deselectDates();
            cal.selectDates(new Date());
        }
    });
    Y.one('.j-calendar-clear').on('click',setCallingNode);
    cal.on('dateClick',function(e){
        var hr=parseInt(f.hr.get('value'),10)
        ;
        //e.date is noon
        setCallingNode(
            moment(e.date)
                .hour(f.am.get('value')==='am'?hr:hr+12)
                .minute(parseInt(f.min.get('value'),10))
                .format(fmt)
        );
    });

    pl.headerNode.delegate('change',function(e){
        var callingNodeValue=callingNode.get('value'),
            nodeDate=moment(callingNodeValue,fmt),
            hr=parseInt(f.hr.get('value'),10)
        ;
        setFirstHourAsNoonOrMidnight();
        if(callingNodeValue!==''&&nodeDate.isValid()){
            setCallingNode(
                nodeDate
                    .hour(f.am.get('value')==='am'?hr:hr+12)
                    .minute(parseInt(f.min.get('value'),10))
                    .format(fmt)
            );
        }
    },'select');

    Y.one('body').delegate('focus',function(){
        var focusValue=this.get('value'),
            nodeDate,
            nodeDateHr,
            nodeDateMin,
            soon=moment().add('hour',1).startOf('hour'),
            soonHr=parseInt(soon.format('H'),10),
            soonAm=soonHr<12?'am':'pm'
        ;
        fmt=this.getAttribute('data-dateFormat')||fmt;

        pl.show();

        if(focusValue===''){
            nodeDate=new Date();
        }else if(moment(focusValue).isValid()){
            nodeDate=moment(focusValue).toDate();
        }else if(moment(focusValue,fmt).isValid()){
            nodeDate=moment(focusValue,fmt).toDate();
        }else{
            //default time
                Y.J.matchSelect(f.hr,soonHr);
                Y.J.matchSelect(f.am,soonAm);
            return;
        }

        callingNode=this;

        pl.get('boundingBox').setXY([this.getX()+2,this.getY()+26]);
        cal.deselectDates();
        //if different month
            if(moment(nodeDate).format('MMYY')!==moment(cal.get('date')).format('MMYY')){
                cal.set('date',nodeDate);
            }
        //set time
            nodeDateHr =parseInt(moment(nodeDate).format('H'),10);
            nodeDateMin=Math.round(parseInt(moment(nodeDate).format('mm'),10)/5)*5;
            Y.J.matchSelect(f.am,nodeDateHr<12?'am':'pm');
            if(nodeDateHr===0||nodeDateHr===12){
                setFirstHourAsNoonOrMidnight();
                f.hr.set('selectedIndex',0);
            }else{
                Y.J.matchSelect(f.hr,nodeDateHr<12?nodeDateHr:nodeDateHr-12);
            }
            Y.J.matchSelect(f.min,nodeDateMin);

        cal.selectDates(nodeDate);
    },'.j-date');

    pl.get('boundingBox').on('clickoutside',function(e){
        if(e.target!==callingNode){pl.hide();}
    });

},'October 2013',{requires:['base','calendar','event-outside','node']});

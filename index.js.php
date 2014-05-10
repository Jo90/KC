<?php //index.js.php

namespace j;

?>
J={
    data:{},
    env:{
        customEventSequence:0, //sequence to help generate unique custom events
        fileserver:'<?php echo J_FILESERVER; ?>',
        server    :'<?php echo J_SERVER; ?>'
    },
    my:{},    //instantiated objects
    rs:{},    //result sets
    std:{     //standards
        format:{
            date    :'d MMM yyyy',
            dateDM  :'d MMM',
            dateDMY :'ddMMyy',
            datetime:'dMMMyy h:mmtt',
            email   :/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
            time    :'h:mmtt'
        }
    },
    tmp:{},
    user:{},
    view:{}
};
//conditional constants
<?php
if (defined('J_ENV_DEVICE')) {echo 'J.env.device="' , J_ENV_DEVICE , '";' , PHP_EOL;}
if (isset($_SESSION[J_LOGON])) {
    $r = Db_Usr::getUsr((object) array('criteria' => (object) array('usrIds' => array($_SESSION[J_LOGON]))));
    $member = Core::firstElement($r->data);
    echo('J.user.usr=' . json_encode($member) . ';' . PHP_EOL);
}
//Challenge Handshake AP >>>>FINISH What about using PHP mcrypt_create_iv Initialization Vector?
$seed      = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
$randomStr = '';
$seedLen   = strlen($seed) - 1;
$i         = 40;
while ($i--) {$randomStr .= substr($seed,rand(0,$seedLen),1);}
$_SESSION[J_SALT] = $randomStr;
echo 'J.user.SALT="' , $_SESSION[J_SALT] , '";' , PHP_EOL;
?>

YUI({<?php require 'modules.inc'; ?>}).use(
    'j-mod-logon',
    function(Y){

        //3.16 bug work around see https://github.com/yui/yui3/issues/1784
        Y.DD.Drag.prototype._handleMouseDownEvent = function(ev) {
            this.fire('drag:mouseDown',{ev:ev});
        };

        Y.on('error',function(type,msg){
            //>>>>DO popup
            alert(type+': '+msg+'!');
        });

        Y.J.dataSet.fetch(
            [
                ['tag','id'],
                ['tagLink','id']
            ]
           ,function(){
                var d={},h={},my={}
                ;

                Y.J.mod.logon({node:Y.one('.j-logon')});

                //clock
                    !function(el,fmt){
                        var clock=function(){el.setContent(new Date().toString(fmt))};
                        clock();
                        setInterval(clock,1000);
                    }(Y.one('.j-clock'),'dddd d-MMMM-yyyy h:mmtt');

                //menu
                    J.my.tabView=new Y.TabView({
                        children:[
                            {label:'about',content:''},
                            {label:'projects/events',content:''},
                            {label:'groups/teams',content:''},
                            {label:'map',content:'<div id="map_canvas" style="width:100%;"></div>'},
                            {label:'roadmap/milestones',content:
                                '<center>'
                               +    '<h2>Kauri Coast Communities</h2>'
                               +    '<h4>Development Roadmap and Milestones</h4>'
                               +'</center>'
                               +'<div class="j-topics">'
                               +    '<p>This is a volunteer project, completely in the nature of this sites purpose.</p>'
                               +    '<ul>'
                               +        '<li>'
                               +            '<h1>Ideas for Features</h1>'
                               +            '<ul>'
                               +                '<li>Map used to display project locations</li>'
                               +                '<li>Filters for all options</li>'
                               +                '<li>Special events include: projects, meetings ,fairs, etc</li>'
                               +                '<li><button>add more (future)</button></li>'
                               +            '</ul>'
                               +        '</li>'
                               +        '<li>'
                               +            '<h1>Plan</h1>'
                               +            '<h2>2014</h2>'
                               +            '<ul>'
                               +                '<li>Initial conceptual idea and thoughts by Kauri Coast Promotion Society Executive and interested parties.</li>'
                               +                '<li>Obtain domain name and hosting.</li>'
                               +                '<li>Setup developmental framework.</li>'
                               +                '<li>Long break due to other commitments.</li>'
                               +                '<li>February</li>'
                               +                '<li>Prototype on to internet</li>'
                               +                '<li>Testing and Feature requests schedule</li>'
                               +            '</ul>'
                               +        '</li>'
                               +'        <li><h2>Concept Development</h2></li>'
                               +'        <li>How to group associated events/groups/projects/etc?</li>'
                               +'    </ul>'
                               +'</div>'
                               +'</center>'
                            }
                        ]
                    }).render('.j-tabs');

                    //shortcuts
                        h.tv={
                            abt:J.my.tabView.item(0),
                            act:J.my.tabView.item(1),
                            grp:J.my.tabView.item(2),
                            map:J.my.tabView.item(3),
                            pln:J.my.tabView.item(4)
                        };
                        h.tvp={
                            abt:h.tv.abt.get('panelNode'),
                            act:h.tv.act.get('panelNode'),
                            grp:h.tv.grp.get('panelNode'),
                            map:h.tv.map.get('panelNode'),
                            pln:h.tv.pln.get('panelNode')
                        };

                    //about
                        Y.use('j-mod-about',function(Y){
                            J.my.about=new Y.J.mod.about({node:h.tvp.abt,main:h});
                        });

                    //listeners
                        //act
                            h.tv.act.after('selectedChange',function(e){
                                if(!J.my.act){
                                    Y.use('j-mod-act',function(Y){
                                        J.my.act=new Y.J.mod.act({
                                            node:h.tvp.act
                                        });
                                    });
                                }
                            });
                        //grp
                            h.tv.grp.after('selectedChange',function(e){
                                if(!J.my.grp){
                                    Y.use('j-mod-grp',function(Y){
                                        J.my.grp=new Y.J.mod.grp({
                                            node:h.tvp.grp
                                        });
                                    });
                                }
                            });
                        //map
                            h.tv.map.after('selectedChange',function(e){
                                if(!my.map){
                                    my.map=new google.maps.Map(document.getElementById("map_canvas"),{
                                        center:new google.maps.LatLng(-35.960000,173.880000),
                                        zoom:12,
                                        mapTypeId:google.maps.MapTypeId.ROADMAP
                                    });
                                }
                            });
            }
        );
    }
);

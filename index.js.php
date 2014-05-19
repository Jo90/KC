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
    my:{},
    rs:{},
    std:{
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
    'j-pod-usr',
    'moment',
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
                ['grp','id'],
                ['tag','id'],
                ['tagLink','id']
            ],
            function(){
                var d={},h={},my={},
                    display,
                    pod
                ;

                Y.J.mod.logon({node:Y.one('.j-logon')});

                //clock
                    !function(el,fmt){
                        var clock=function(){el.setContent(moment().format(fmt));};
                        clock();
                        setInterval(clock,60000);
                    }(Y.one('.j-clock'),'dddd MMMM Do, h:mma');

                //menu
                    J.my.tabView=new Y.TabView({
                        children:[
                            {label:'home',content:
                                '<select class="j-purpose j-i" title="select either yourself or your organisation"><option title="myself">I</option><option title="a team or organisation I belong to">My group</option></select>'
                               +'<select class="j-purpose j-offer" title="whether you or your organisation can help or needs help with something"><option title="would benefit from">would like</option><option title="require help/support for">need help</option></select> to '
                               +'<select class="j-purpose j-interest" title="possible opportunities/benefits from becoming involved"></select>'
                               +'<div class="j-abt-content"></div>'
                               +'<small><small><a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by/4.0/80x15.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Community & Volunteer Information Hub</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">KCPS</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.</small></small>'
                            },
                            {label:'groups/teams',content:''},
                            {label:'projects/events',content:''},
                            {label:'map',content:'<div id="map_canvas" style="width:100%;"></div>'},
                            {label:'roadmap/milestones',content:
                                '<center>'
                               +    '<h2>Kauri Coast Communities</h2>'
                               +    '<h4>Development Roadmap and Milestones</h4>'
                               +'</center>'
                               +'<div class="j-topics">'
                               +    '<p>This is a volunteer project, completely in the nature of this sites purpose.</p>'
                               +    '<p>If you have IT skills or would just like to learn - we really need your help for ideas, design, testing and development. Make a difference and get involved. Email Joe at joe@dargaville.net or call on 439-4889, I would be very happy to talk.</p>'
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
                            grp:J.my.tabView.item(1),
                            act:J.my.tabView.item(2),
                            map:J.my.tabView.item(3),
                            pln:J.my.tabView.item(4)
                        };
                        h.tvp={
                            abt:h.tv.abt.get('panelNode'),
                            grp:h.tv.grp.get('panelNode'),
                            act:h.tv.act.get('panelNode'),
                            map:h.tv.map.get('panelNode'),
                            pln:h.tv.pln.get('panelNode')
                        };

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

                //home page
                    h.tvp.abt.delegate('change',function(){
                        var html='',
                            idx=this.get('selectedIndex'),
                            qI       =h.tvp.abt.one('.j-i'),
                            qOffer   =h.tvp.abt.one('.j-offer'),
                            qInterest=h.tvp.abt.one('.j-interest')
                        ;
                        if(this.hasClass('j-i')){
                            qOffer.get('options').item(1).set('text','need'+(idx===1?'s':'')+' help');
                            qOffer.simulate('change');
                        }else if(this.hasClass('j-offer')){

                            if(qI.get('selectedIndex')===0){ //I
                                if(qOffer.get('selectedIndex')===0){ //would like
                                    qInterest.set('innerHTML',
                                        '<optgroup label="understand">'
                                        +  '<option class="j-interest j-interest1">understand what this site is about</option>'
                                        +  '<option class="j-interest j-interest2">understand how volunteering can help me</option>'
                                        +'</optgroup>'
                                        +'<optgroup label="help and involvement">'
                                        +  '<option class="j-interest j-interest3">see what opportunities exist in the community</option>'
                                        +  '<option class="j-interest j-interest8">start a project</option>'
                                        +  '<option class="j-interest j-interest4">share my vision and get people involved</option>'
                                        +  '<option class="j-interest j-interest7">make a difference - opportunities for leadership</option>'
                                        +'</optgroup>'
                                        +'<optgroup label="learn">'
                                        +  '<option class="j-interest j-interest5">learn through networking - opportunities to meet like minded people</option>'
                                        +  '<option class="j-interest j-interest6">learn raise my profile</option>'
                                        +'<optgroup label="reinvigorate">'
                                        +  '<option class="j-interest j-interest6">get out of a rut - opportunities to expand your horizons</option>'
                                        +'</optgroup>');
                                }else{ //needs help
                                    qInterest.set('innerHTML',
                                        '<optgroup label="learn">'
                                       +  '<option class="j-interest j-interest5">learn through networking - opportunities to meet like minded people</option>'
                                       +  '<option class="j-interest j-interest6">learn raise my profile</option>'
                                       +'</optgroup>'
                                       +'<optgroup label="reinvigorate">'
                                       +  '<option class="j-interest j-interest6">get out of a rut - opportunities to expand your horizons</option>'
                                       +'</optgroup>');
                                }
                            }else{ //My group
                                if(qOffer.get('selectedIndex')===0){ //would like
                                    qInterest.set('innerHTML',
                                        '<optgroup label="collaborate">'
                                        +  '<option class="j-interest j-interest1">Meet and visit with other groups i.e. famils</option>'
                                        +  '<option class="j-interest j-interest2">Find ways to help each other</option>'
                                        +  '<option class="j-interest j-interest2">Memorandum of Understandings</option>'
                                        +'</optgroup>');
                                }else{
                                    qInterest.set('innerHTML',
                                        '<optgroup label="recruit members">'
                                        +  '<option class="j-interest j-interest1">Finding the right people for your group</option>'
                                        +  '<option class="j-interest j-interest2">Advertising</option>'
                                        +  '<option class="j-interest j-interest2">Open activities</option>'
                                        +'</optgroup>'
                                        +'<optgroup label="find helpers">'
                                        +  '<option class="j-interest j-interest3">see what opportunities exist in the community</option>'
                                        +  '<option class="j-interest j-interest8">start a project</option>'
                                        +  '<option class="j-interest j-interest4">share my vision and get people involved</option>'
                                        +  '<option class="j-interest j-interest7">make a difference - opportunities for leadership</option>'
                                        +'</optgroup>'
                                        +'<optgroup label="train">'
                                        +  '<option class="j-interest j-interest5">learn through networking - opportunities to meet like minded people</option>'
                                        +  '<option class="j-interest j-interest6">find someone to help teach a skill i.e. secretary, treasurer</option>'
                                        +'</optgroup>');
                                }
                            }
                            qInterest.simulate('change');
                        }else if(this.hasClass('j-interest')){
                            <?php require 'reasons.js'; ?>
                            h.tvp.abt.one('.j-abt-content').set('innerHTML',html);
                        }
                    },'.j-purpose');
                //
                    h.tvp.abt.one('.j-abt-content').delegate('click',function(){
                        if(this.hasClass('j-page-grp')){J.my.tabView.selectChild(1);}
                        if(this.hasClass('j-page-prj')){J.my.tabView.selectChild(2);}
                        if(this.hasClass('j-btn-involved')){alert('How to get involved through group questions, coming...');}
                        
                    },'.j-topic');

                pod={
                    display:{
                        usr:function(){
                            if(my.podUsr==undefined){pod.load.usr();return false;}
                            my.podUsr.display({visible:true});
                        }
                    },
                    load:{
                        usr:function(){
                            Y.use('j-pod-usr',function(Y){
                                my.podUsr=new Y.J.pod.usr({visible:false});
                                Y.J.whenAvailable.inDOM(my,'podUsr.display',pod.display.usr);
                                Y.on(my.podUsr.customEvent.save,pod.result.usr);
                                Y.on('j:logout',function(){delete my.podUsr;});
                            });
                        }
                    },
                    result:{
                        usr:function(rs){
                            alert('user changed');
                        }
                    }
                };
                //attach usr pod to logged on user
                    Y.one('.j-logon').delegate('click',pod.display.usr,'.j-member')
                
                //initialize
                    h.tvp.abt.one('.j-i').simulate('change');

            }
        );
    }
);

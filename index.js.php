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
    'j-widget',
    'moment',
    function(Y){

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
                        '<select class="j-purpose j-myFocus" title="select your area of focus">'
                       +  '<option title="myself">I</option>'
                       +  '<option title="a team or organisation I belong to">My group</option>'
                       +  '<option title="the community I belong to">My community</option>'
                       +  '<option title="my work and/or business">My business</option>'
                       +'</select>'
                       +'<select class="j-purpose j-offer" title="whether you or your organisation can help or needs help with something">'
                       +  '<option title="I and/or my organisation can benefit by">can benefit from</option>'
                       +  '<option title="I and/or my organisation would like to offer">would like to</option>'
                       +  '<option title="I and/or my organisation require help/support to">need help to</option>'
                       +'</select>'
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
                var myFocus  =this.get('selectedIndex'),
                    qI       =h.tvp.abt.one('.j-myFocus'),
                    qOffer   =h.tvp.abt.one('.j-offer'),
                    qInterest=h.tvp.abt.one('.j-interest'),
                    fOpts=function(){
                        var html='',
                            fGrp=function(a){
                                var opts={
                                        1 :'understand what this site is about',
                                        2 :'understand how volunteering can help me',
                                        3 :'see what opportunities exist in the community',
                                        4 :'start a project',
                                        5 :'share my vision and get people involved',
                                        6 :'make a difference - opportunities for leadership',
                                        7 :'learn through networking - opportunities to meet like minded people',
                                        8 :'learn raise my profile',
                                        9 :'get out of a rut - opportunities to expand your horizons',
                                        10:'Meet and visit with other groups i.e. famils',
                                        11:'Find ways to help each other',
                                        12:'Memorandum of Understandings',
                                        13:'Finding the right people for your group',
                                        14:'Advertising',
                                        15:'Open activities',
                                        16:'see what opportunities exist in the community',
                                        17:'start a project',
                                        18:'share my vision and get people involved',
                                        19:'make a difference - opportunities for leadership',
                                        20:'find someone to help teach a skill i.e. secretary, treasurer'
                                    },
                                    html=''
                                ;
                                for(var i=1;i<a.length;i++){html+='<option class="j-interest j-interest'+a[i]+'">'+opts[a[i]]+'</option>';}
                                return '<optgroup label="'+a[0]+'">'+html+'</optgroup>';
                            }
                        ;
                        for(var g=0;g<arguments.length;g++){html+=fGrp(arguments[g]);};
                        qInterest.set('innerHTML',html);
                    }
                ;
                if(this.hasClass('j-myFocus')){
                    qOffer.get('options').item(2).set('text','need'+(myFocus===0?'':'s')+' help to');
                    qOffer.simulate('change');
                }else if(this.hasClass('j-offer')){
                    //level 1: I, my group, my community, my business
                    //level 2: benefit, like, needs
                    switch(qI.get('selectedIndex')){
                        case 0: //I
                            switch(qOffer.get('selectedIndex')){
                                case 0:fOpts(['understand',1,2],['help and involvement',3,4,5,6],['learn',7,8],['reinvigorate',9]);break;
                                case 1:fOpts(['understand',1,2],['learn',7,8],['reinvigorate',9]);break;
                                case 2:fOpts(['learn',7,8],['reinvigorate',9]);break;
                            }
                            break;
                        case 1: //My group
                            switch(qOffer.get('selectedIndex')){
                                case 0:fOpts(['collaborate',10,11,12]);break;
                                case 1:fOpts(['recruit',13,14,15],['???',16,17,18,19]);break;
                                case 2:fOpts(['train',6,20]);break;
                            }
                            break;
                        case 2: //My community
                            switch(qOffer.get('selectedIndex')){
                                case 0:fOpts(['collaborate',10,11,12]);break;
                                case 1:fOpts(['recruit',13,14,15],['???',16,17,18,19]);break;
                                case 2:fOpts(['train',6,20]);break;
                            }
                            break;
                        case 3: //My business
                            switch(qOffer.get('selectedIndex')){
                                case 0:fOpts(['collaborate',10,11,12]);break;
                                default:fOpts(['recruit',13,14,15],['???',16,17,18,19]);
                            }
                            break;
                    }
                    qInterest.simulate('change');
                }else if(this.hasClass('j-interest')){
                    <?php require 'reasons.js'; ?>
                    h.tvp.abt.one('.j-abt-content').set('innerHTML',html);
                }
            },'.j-purpose');

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
            h.tvp.abt.one('.j-myFocus').simulate('change');

    }
);

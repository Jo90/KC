<?php
/** /index.js.php
 *
 *  Kauri Coast Promotion Society
 *
 */
namespace kc;
require_once 'kc-config.php';
include_once 'init.js.php';
?>
//debug YUI({filter:'raw',
YUI({<?php require 'kc-modules.inc'; ?>}).use(
    'kc-common'
   ,'kc-pod-userLogon'
   ,function(Y){

        Y.KC.dataSet.fetch(
            [
                ['dbTable'          ,'name']
               ,['grp'              ,'id']
               ,['tgTag'            ,'id']
               ,['tgCollection'     ,'id']
               ,['tgCollectionTable','id']
               ,['tgCollectionTag'  ,'id']
            ]
           ,function(){
                var d={},h={},my={}
                ;
                KC.my.userLogon=new Y.KC.pod.userLogon({
                    node:Y.one('.kc-userLogon')
                   ,nodeInfo:Y.one('.kc-userLogon-info')
                });
                //clock
                    (function(el,fmt){
                        var clock=function(){el.setContent(new Date().toString(fmt))};
                        clock();
                        setInterval(clock,1000);
                    })(Y.one('.kc-clock'),'dddd d-MMMM-yyyy h:mmtt');

                //tab view
                    KC.my.tabView=new Y.TabView({
                        children:[
                            {label:'about',content:''}
                           ,{label:'projects/events',content:''}
                           ,{label:'groups/teams',content:''}
                           ,{label:'map',content:'<div id="map_canvas" style="width:100%;"></div>'}
                           ,{label:'roadmap/milestones',content:
                                '<center>'
                               +'    <h1>Kauri Coast Communities</h1>'
                               +'    <h3>Development Roadmap and Milestones</h3>'
                               +'</center>'
                               +'<div class="kc-topics">'
                               +'    <p>This is a volunteer project, completely in the nature of this sites purpose.</p>'
                               +'    <ul>'
                               +'        <li><h1>2012</h1></li>'
                               +'        <li><h2>September</h2></li>'
                               +'        <li>Initial prototype for conceptual review by Kauri Coast Promotion Society Executive and interested parties.</li>'
                               +'        <li>Prototype on to internet</li>'
                               +'        <li><h2>October</h2></li>'
                               +'        <li>Testing and Feature requests schedule</li>'
                               +'        <li>Determine short and longer term objectives</li>'
                               +'        <li>3 Month Plan</li>'
                               +'        <li><h2>Ideas for Features</h2></li>'
                               +'        <li>Map used to display project locations</li>'
                               +'        <li>Filters for all options</li>'
                               +'        <li>Special events include: projects, meetings ,fairs, etc</li>'
                               +'        <li><h2>Concept Development</h2></li>'
                               +'        <li>How to group associated events/groups/projects/etc?</li>'
                               +'    </ul>'
                               +'</div>'
                               +'</center>'
                            }
                        ]
                    }).render('.kc-tabs');
                    //shortcuts
                        h.tv={
                            abt:KC.my.tabView.item(0)
                           ,act:KC.my.tabView.item(1)
                           ,grp:KC.my.tabView.item(2)
                           ,map:KC.my.tabView.item(3)
                           ,pln:KC.my.tabView.item(4)
                        };
                        h.tvp={
                            abt:h.tv.abt.get('panelNode')
                           ,act:h.tv.act.get('panelNode')
                           ,grp:h.tv.grp.get('panelNode')
                           ,map:h.tv.map.get('panelNode')
                           ,pln:h.tv.pln.get('panelNode')
                        };
                    //about
                        Y.use('kc-mod-about',function(Y){
                            KC.my.about=new Y.KC.mod.about({node:h.tvp.abt,main:h});
                        });
                    //listeners
                        //act
                            h.tv.act.after('selectedChange',function(e){
                                if(!KC.my.act){
                                    Y.use('kc-mod-act',function(Y){
                                        KC.my.act=new Y.KC.mod.act({
                                            node:h.tvp.act
                                        });
                                    });
                                }
                            });
                        //grp
                            h.tv.grp.after('selectedChange',function(e){
                                if(!KC.my.grp){
                                    Y.use('kc-mod-grp',function(Y){
                                        KC.my.grp=new Y.KC.mod.grp({
                                            node:h.tvp.grp
                                        });
                                    });
                                }
                            });
                        //map
                            h.tv.map.after('selectedChange',function(e){
                                if(!my.map){
                                    my.map=new google.maps.Map(document.getElementById("map_canvas"),{
                                        center:new google.maps.LatLng(-35.960000,173.880000)
                                       ,zoom:12
                                       ,mapTypeId:google.maps.MapTypeId.ROADMAP
                                    });
                                }
                            });
            }
        );
    }
);
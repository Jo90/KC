<?php
/** /index.js.php
 *
 *  Wiseberry Administration Module
 *
 */
require_once 'wb-config.php';
include_once 'init.js.php';
include_once 'userData.js.php';
?>
//debug YUI({filter:'raw',
YUI({<?php require 'wb-modules.inc'; ?>}).use(
    'wb-mod-news'
   ,'wb-mod-roleMenu'
   ,'wb-plugin-tabViewRemovable'
   ,'wb-plugin-tabViewRoleMenu'
   ,'wb-widget'
   ,'widget-position-align'
   ,function(Y){

        Y.WB.dataSet.fetch(
            [
                ['language','id']
               ,['libTag','id']
               ,['libTagChild']
               ,['locationCountry','id']
               ,['measure']
               ,['organisationRole','id']
               ,['process','id']
               ,['processMenu','process']
               ,['processPropertyStateTypeTransition','process']
               ,['role','id']
               ,['theme','id']
            ]
           ,function(){

                WB.my.userLogon=new Y.WB.pod.userLogon({
                    node:Y.one('.wb-userLogon')
                   ,nodeInfo:Y.one('.wb-userLogon-info')
                });

                //theme
                    new Y.WB.widget.themeSelector({node:Y.one('.wb-themes')});

                //clock
                    (function(el,fmt){
                        var clock=function(){el.setContent(new Date().toString(fmt))};
                        clock();
                        setInterval(clock,1000);
                    })(Y.one('.wb-clock'),'dddd d-MMMM-yyyy h:mmtt');

                //contact organisation role
                    WB.my.contactOrganisationRole=new Y.WB.mod.contactOrganisationRole({
                        node:Y.one('select.wb-contactOrganisationRole')
                       ,userLogonInstance:WB.my.userLogon
                    });

                //menu
                    WB.my.roleMenu=new Y.WB.mod.roleMenu({
                        node:Y.one('.wb-roleMenu')
                       ,contactOrganisationRoleInstance:WB.my.contactOrganisationRole
                    });

                //tab view
                    WB.my.tabView=new Y.TabView({
                        children:[{label:'News',content:''}]
                       ,plugins:[
                            Y.WB.plugin.TabViewRemovable
                           ,{fn:Y.WB.plugin.TabViewRoleMenu,cfg:{roleMenuInstance:WB.my.roleMenu}}
                        ]
                    }).render('.wb-tabView');

                //default tabview news
                    WB.my.news=new Y.WB.mod.news({
                        node: WB.my.tabView._items[0].get('panelNode')
                    });

            }
        );
    }
);

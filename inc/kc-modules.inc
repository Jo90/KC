/* Kauri Coast Promotion Society Information Hub Modules */
modules:{
    'kc-common':{
        fullpath:'/js/common.js'
       ,requires:[
            'anim'
           ,'array'
           ,'base'
           ,'collection'
           ,'console'
           ,'cookie'
           ,'datatype'
           ,'datatable'
           ,'datatable-sort'
           ,'dd'
           ,'event'
           ,'io'
           ,'json'
           ,'kc-pod-editor'
           ,'kc-utl-date'
           ,'kc-widget'
           ,'kc-yui3-sugar'
           ,'model'
           ,'node'
           ,'node-event-simulate'
           ,'oop'
           ,'overlay'
           ,'recordset'
           ,'resize-plugin'
           ,'selector-css3'
           ,'substitute'
           ,'tabview'
           ,'yql'
        ]
    }
    /**
     * css
     */
   ,'kc-css-calendar':{
        fullpath:'/css/widget/calendar.css'
       ,type:'css'
    }
   ,'kc-css-dialogMask':{
        fullpath:'/css/widget/dialogMask.css'
       ,type:'css'
    }
   ,'kc-css-mod-about':{
        fullpath:'/css/mod/about.css'
       ,type:'css'
    }
   ,'kc-css-mod-act':{
        fullpath:'/css/mod/act.css'
       ,type:'css'
    }
   ,'kc-css-mod-grp':{
        fullpath:'/css/mod/grp.css'
       ,type:'css'
    }
   ,'kc-css-pod-info':{
        fullpath:'/css/pod/info.css'
       ,type:'css'
    }
   ,'kc-css-pod-grpEdit':{
        fullpath:'/css/pod/grpEdit.css'
       ,type:'css'
    }
   ,'kc-css-pod-report':{
        fullpath:'/css/pod/report.css'
       ,type:'css'
    }
   ,'kc-css-pod-userLogon':{
        fullpath:'/css/pod/userLogon.css'
       ,type:'css'
    }
    /**
     * modules
     */
   ,'kc-mod-about':{
        fullpath:'/mod/about.js'
       ,requires:['kc-common','kc-css-mod-about']
    }
   ,'kc-mod-act':{
        fullpath:'/mod/act.js'
       ,requires:['kc-common','kc-css-mod-act']
    }
   ,'kc-mod-grp':{
        fullpath:'/mod/grp.js'
       ,requires:['kc-common','kc-css-mod-grp']
    }
    /**
     * plugins
     */
   ,'kc-plugin-ckEditor':{
        fullpath:'/js/plugin/ckeditor/ckeditor.js'
    }
   ,'kc-plugin-tabViewRemovable':{
        fullpath:'/mod/tabView/pluginRemovable.js'
       ,requires:['tabview']
    }
    /**
     * pods (independant overlays)
     */
   ,'kc-pod-editor':{
        fullpath:'/pod/editor.js'
       ,requires:['kc-common','kc-plugin-ckEditor']
    }
   ,'kc-pod-grpEdit':{
        fullpath:'/pod/grpEdit.js'
       ,requires:['kc-common','kc-css-pod-grpEdit']
    }
   ,'kc-pod-info':{
        fullpath:'/pod/info.js'
       ,requires:['kc-common','kc-css-pod-info','kc-pod-editor','sortable']
    }
   ,'kc-pod-report':{
        fullpath:'/pod/report.js'
       ,requires:['kc-common','kc-css-pod-report']
    }
   ,'kc-pod-userLogon':{
        fullpath:'/pod/userLogon.php'
       ,requires:['kc-css-pod-userLogon','kc-js-sha1']
    }
    /**
     * utilities
     */
   ,'kc-js-sha1':{ //secure hash algorithym
        fullpath:'/js/sha1.js'
    }
   ,'kc-yui3-sugar': {
         fullpath: '/js/yui3-sugar.js',
         requires:['node','transition']
    }
    /**
     * widgets
     */
   ,'kc-widget':{
        fullpath:'/widget/base.js'
       ,requires:[
            'kc-widget-calendar'
           ,'kc-widget-dialogMask'
           ,'kc-widget-list'
           ,'kc-widget-message'
        ]
    }
   ,'kc-widget-calendar':{
         fullpath:'/widget/calendar.js'
        ,requires:['calendar','kc-common','kc-css-calendar']
    }
   ,'kc-widget-dialogMask':{
         fullpath:'/widget/dialogMask.js'
        ,requires:['base','node','kc-css-dialogMask']
    }
   ,'kc-widget-list':{
        fullpath:'/widget/list.js'
       ,requires:['kc-common']
    }
   ,'kc-widget-message':{
        fullpath:'/widget/message.js'
       ,requires:['kc-common']
    }
}
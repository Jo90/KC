/** /js/common.js
 *
 *  Kauri Coast Promotion Society
 *
 */
YUI.add('kc-common',function(Y){

    Y.namespace('KC');

    Y.KC.checkEmail=function(email){
        var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
        return filter.test(email);
    };

    //tag collections for a dbTable
    Y.KC.collection=function(dbTable){
        var collection={dbTable:dbTable}
        ;
        Y.each(KC.data.tgCollectionTable,function(collectionTable){
            var col=collectionTable.collection
            ;
            if(collectionTable.dbTable===dbTable){
                if(typeof collection[col]==='undefined'){collection[col]={};}
                collection[col].tgCollectionTable=collectionTable;
                collection[col].tgCollection=KC.data.tgCollection[col];
                //
                collection[col].tgCollectionTag=[];
                Y.each(KC.data.tgCollectionTag,function(collectionTag){
                    if(collectionTag.collection===col){
                        collectionTag.tgName=KC.data.tgTag[collectionTag.tag].name;
                        collection[col].tgCollectionTag.push(collectionTag);
                    }
                });
            }
        });
        return collection;
    };

    Y.KC.dataSet={ //table, pk field, field
        fetch:function(dataSets,callback){
            var i=dataSets.length
               ,missing=[]
               ,missingDatasets=[]
            ;
            while(i--){
                if(!KC.data[dataSets[i][0]]){
                    missing.push(dataSets[i][0]);
                    missingDatasets.push(dataSets[i]);
                }
            }
            if(missing.length>0){
                Y.io('/inc/getDataSets.php',{
                    method:'POST'
                   ,on:{
                        complete:function(id,o){
                            Y.KC.dataSet.reformat(Y.JSON.parse(o.responseText),missingDatasets);
                            callback();
                        }
                    }
                   ,data:'d[]='+missing.join('&d[]=')
                });
            }else{
                callback();
            }
        }
        /**
         *  convert resultSets.dataSet.data,meta to KC.data.dataSet and KC.meta.dataSet
         *  arg[0] = result.dataSet.data and result.dataSet.meta
         *  args[1] = primary key field name i.e. 'id'
         *  args[2] = return type i.e. 'object'(default), 'array', 'raw'
         *  args[3] = alternative dataSet name
         */
       ,reformat:function(rs,dataSets){
            var c
               ,dsName,dsPK,dsPKvalue,dsRecordType='object'
               ,i=dataSets.length
               ,newRec
               ,rsDS //result data set
            ;
            if(!KC.data){KC.data={};};
            if(!KC.meta){KC.meta={};};
            //critera
            while(i--){
                dsName=dataSets[i][3] || dataSets[i][0];
                dsPK=dataSets[i][1] || '';
                dsRecordType=dataSets[i][2] || 'object';
                rsDS=rs[dataSets[i][0]];
                if(rsDS){
                    if(rsDS.meta){KC.meta[dsName]=rsDS.meta;}
                    //if pk then object else array
                    KC.data[dsName]=dsPK===''?[]:{};
                    //data
                    if(typeof rsDS.meta==='undefined'
                        || dsPK===''
                        || dsRecordType==='raw'){
                        KC.data[dsName]=rsDS.data;
                    }else{
                        newRec=dsRecordType==='object'?{}:[];
                        Y.each(rsDS.data,function(n){
                            c=0;
                            Y.each(rsDS.meta,function(m){
                                if(dsPK&&dsPK===m.name){dsPKvalue=n[c];}
                                dsRecordType==='object'
                                    ?newRec[m.name]=n[c]
                                    :newRec.push(n[c]);
                                c++;
                            });
                            dsPK===''
                                ?KC.data[dsName].push(Y.clone(newRec,true))
                                :KC.data[dsName][dsPKvalue]=Y.clone(newRec,true);
                        });
                    }
                }
            }
        }
    };

    Y.KC.firstRecord=function(o){
        for(r in o){if(o.hasOwnProperty(r)){return o[r];}}
    };

    Y.KC.html=function(template,tags,inc){
        var self=this
           ,tpl=this.html['TEMPLATE'][template]
           ,html=''
           ,obj={}
           ,fnIncludeSnippets=function(n){
                if(self.html['SNIPPET'][n]){
                    obj[n]=self.html['SNIPPET'][n];
                }
            }
           ,tagProperty
           ,fnDefaults=function(n){
                var x;
                for(tagProperty in tags){if(tags.hasOwnProperty(tagProperty)){
                    if(n._id===tagProperty && n[tags[tagProperty]]){
                        html=Y.substitute(html,n[tags[tagProperty]]);
                    }
                }}
            }
        ;
        if(!tpl){return '<em>template not found</em>';}
        //tags
            html=Y.substitute(tpl,tags);
        //includes
            if(inc){
                Y.each(inc,fnIncludeSnippets);
                html=Y.substitute(html,obj);
            }
        //defaults
            Y.each(this.html['DEFAULT'],fnDefaults);
        //clear
            html=Y.substitute(html,this.html['TAG']);
        return html;
    };
    Y.KC.html['TEMPLATE']={
        'button'            :'{prefix}<a class="button kc-{action} {classes} {showOnFocus}" name="{name}" title="{title}"><span>{label}</span></a>{suffix}'
       ,'kc-icon'           :'{prefix}<span class="kc-icon kc-{action} {classes} {showOnFocus}" title="{title}"><em></em><span>{label}</span></span>{suffix}'
       ,'btn'               :'{prefix}<a class="kc-btn kc-{action} {classes} {showOnFocus}" title="{title}"><em></em><span>{label}</span><span class="kc-flag">{flag}</span></a>{suffix}'
       ,'btn-tag'           :'{prefix}<a class="button {classes} {showOnFocus}" title="{title}"><em></em><span>{label}</span><span class="kc-flag">{flag}</span></a>{suffix}'
       ,'btn-gen'           :'{prefix}<a class="kc-btn-gen kc-{action} {classes} {showOnFocus}" title="{title}"><em></em><span>{label}</span></a>{suffix}'
       ,'btn-toggleShowHide':'<a class="kc-btn-gen kc-toggleShowHide {show}" title="show/hide"><em></em></a>'
       ,'switch'            :'<label class="{classes}" title="{title}">{prefix}<input type="checkbox" checked="{checked}" value="{value}">{label}{suffix}</label>'
       ,'toggleCheckbox'    :'<label><input type="checkbox" class="kc-toggleChecked" checked="{value}" title="check/uncheck" />{label}</label>'
       ,'selectCheckbox'    :'<label><input type="checkbox" class="{classes}"  title="check/uncheck" />{label}</label>'
       ,'radio'             :'<label><input type="radio" name="{name}" class="{classes}"  title="select" />{label}</label>'
       ,'removeCheckbox'    :'<label><input type="checkbox" class="kc-remove" />remove</label>'
       ,'textIcon'          :'<label class="kc-text kc-{icon}"><em></em><span>{text}</span></label>'
    };
    //device dependant
        //phone overrides
        if(KC.env.device==='phone'){
            //>>>>>>>>>>>>>>>FINISH what html to use for phone alternative to checkbox?
            Y.KC.html['TEMPLATE']['switch']='<label><input type="text" value="{value}">{label}</label>';
            Y.KC.html['TEMPLATE']['toggleCheckbox']='<!--sort this out-->';
        }
    Y.KC.html['SNIPPET']={
        'showOnFocus' :'hide on-record-hover-show on-record-focus-show'
    };
    //i.e. for action==='add' set missing label and title
    Y.KC.html['DEFAULT']=[
        {
            _id   :'action'
           ,add   :{label:'',title:'add record'}
           ,close :{label:'',title:'close'}
           ,find  :{label:'',title:'find/search'}
           ,remove:{label:'',title:'remove record'}
           ,reset :{label:'reset',title:'reset the form'}
           ,save  :{label:'save',title:'save data'}
        }
    ];
    Y.KC.html['TAG']={action:'',checked:'',classes:'',flag:'',label:'',prefix:'',show:'',showOnFocus:'',suffix:'',title:'',value:''};

    Y.KC.removeOption=function(node){
        node.one('.kc-remove').remove();
        node.append(Y.KC.html('removeCheckbox'));
    };

    Y.KC.whenAvailable={
        timer:null
       ,listener:function(){
            var q=Y.KC.whenAvailable.queue
               ,i=q.length-1
               ,defined
               ,objStem
               ,now=new Date()
            ;
            for(;i>=0;i--){
                //sentry, timed out?
                    if(q[i].submitted.getTime()<(now.getTime()-10000)){
                        //remove and alert
                            alert('waiting for '+q[i].objBranch+' has timed out (10sec)');
                            q.splice(i,1);
                        continue;
                    }
                //init for record
                    objStem=q[i].objBase;
                    defined=true;
                //each branch defined?
                    Y.each(q[i].objBranch.split('.'),function(n){
                        //stem exists
                            if(typeof objStem[n]!=='undefined'){
                                objStem=objStem[n];
                            }else{
                                defined=false;
                            }
                    });
                if(defined){
                    //callback
                        q[i].callback.apply(q[i].objBase,q[i].args);
                    //remove
                        q.splice(i,1);
                }
            }
            //if empty stop
                if(q.length===0){
                    clearInterval(Y.KC.whenAvailable.timer);
                    Y.KC.whenAvailable.timer=null;
                }
        }
       ,queue:[] //{objBranch:'WB.pod.something',callback:function,objBase:objBase}
       ,status:function(){
            alert(Y.KC.whenAvailable.queue.toString());
        }
       ,inDOM:function(objBase,objBranch,callback,args){ //str,fn,obj,obj
            //push to queue
            Y.KC.whenAvailable.queue.push({
                objBranch:objBranch
               ,callback:callback
               ,objBase:objBase
               ,submitted:new Date()
               ,args:args
            });
            //kickoff listener
            if(Y.KC.whenAvailable.timer===null){
                Y.KC.whenAvailable.timer=setInterval(Y.KC.whenAvailable.listener,200); //every 0.2 sec
            }
        }
    };

},'1.0 Aug 2012',{requires:['base','node']});

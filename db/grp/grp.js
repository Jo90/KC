/** /db/siud/grp.js
 *
 *  Kauri Coast Promotion Society
 *
 */
YUI.add('kc-entity-grp',function(Y){

    KC.entity.grp={
        model:Y.Base.create('grp',Y.Model,[],{},{
            ATTRS:{
                id           :{},
                name         :{value:'new group'},
                created      :{value:new Date()},
                contactDetail:{value:'how to contact us'}
            }
        }),
        data:{},
        db:function(p){
            //defaults
                if(!p){p={};}
                p.action=Y.Lang.isString(p.action)?p.action:'s';
                p.post  =Y.Lang.isArray(p.post)   ?p.post  :[{criteria:{grpIds:[]}}];
                p.action=p.action.toLowerCase()[0];
                if(Y.Array.indexOf(['s','i','u','d'],p.action)===-1){
                    Y.fire('error',{
                        type:'grp',
                        msg :'invalid group action'
                    });
                    return;
                }
            Y.io('/db/grp/'+p.action+'.php',{
                method:'POST',
                on:{complete:function(id,o){
                    var rs=Y.JSON.parse(o.responseText);
                    if(typeof p.callback!=='undefined' && Y.Lang.isFunction(p.callback)){p.callback();};
                    Y.fire('kc-db-grp:'+p.action,rs);
                }},
                data:Y.JSON.stringify(p.post)
            });
        }
    };

},'2013',{requires:['base','io','node']});

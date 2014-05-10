//lib/db.js

YUI.add('j-db',function(Y){
    "use strict";
    Y.namespace('J.db');

    Y.J.db.base={
        clear:function(dbTable){
            Y.J.db[dbTable].data={};
        }





    };

    Y.J.db.grp={
        data:{},
        clear:function(){
            Y.J.db.grp.data={};
        },
        fetch:function(){
            var post={}
            ;
            if(J.user.usr!==undefined){post.user=J.user.usr;}
            Y.io('/db/grp_s.php',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                on:{complete:function(id,o){
                    Y.fire('j-db-grp:s',Y.JSON.parse(o.responseText)[0].result);
                }},
                data:Y.JSON.stringify([post])
            });

        },
        update:function(post){
            if(J.user.usr!==undefined){post.user=J.user.usr;}
            Y.io('/db/grp_s.php',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                on:{complete:function(id,o){
                    Y.fire('j-db-grp:iud',Y.JSON.parse(o.responseText)[0].result);
                }},
                data:Y.JSON.stringify([post])
            });

        }
    };



},'1.0 January 2014',{requires:['base','io','node']});

/** //lib/address.js
 *
 */
YUI.add('ja-lib-address',function(Y){
    "use strict";
    Y.namespace('JA.lib').address={

        fetch:function(args){
            Y.JA.widget.busy.set('message','getting address...');
            args.post.user=JA.user.usr;
            Y.io('/db/address/siud.php',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                on:{complete:args.callback},
                data:Y.JSON.stringify([args.post])
            });
        }

    };

});

<?php
/** //mod/logon.php
 *
 * //>>>>To do
 * - multiple failed logon attempts http://stackoverflow.com/questions/2090910/how-can-i-throttle-user-login-attempts-in-php
 * - forgot option
 * - new account request option
 * - no activity - how long to maintain session?
 * - verify password process/validation
 * - new password strength
 */
namespace j;

if (isset($_REQUEST['logout'])) {unset($_SESSION[J_LOGON]); exit;}
if (isset($_REQUEST['logon'], $_REQUEST['hash'])) {
    $r = Db_Usr::getUsr((object) array('criteria' => (object) array('logon' => $_REQUEST['logon'])));
    if (!isset($r->data)) {exit;}
    $member = Core::firstElement($r->data);
    if (!isset($member)) {exit;}
    //verify password
    if (SHA1($member->password . SHA1($_SESSION[J_SALT])) == $_REQUEST['hash']) {
        $_SESSION[J_LOGON] = $member->id;
        //security
        unset($member->logon);
        unset($member->password);
    } else exit;
    header('Content-type: application/json');
    exit(json_encode($r));
}
?>

YUI.add('j-mod-logon',function(Y){

    Y.namespace('J.mod').logon=function(cfg){

        if(cfg===undefined||cfg.node===undefined){alert('mod-logon-parameter error');return;}

        cfg=Y.merge({
            title :'user login'
        },cfg);

        var d={
                COOKIE:{
                    USERNAME:'<?php echo J_LOGON; ?>'
                }
            },
            h={},
            io={},
            listeners,
            render={}
        ;

        io={
            forgot:function(){
                //>>>>FINISH
                alert('forgot password function/process not implemented yet.');
            },
            heartbeat:function(){
                //>>>>FINISH logout after period of inactivity
                //>>>>how?
                //purpose to maintain php session lifetime
                //>>>>how long?
                Y.io('/inc/heartbeat.php',{
                    method:'POST',
                    on:{complete:function(){
                        //some status i.e. connected users
                    }},
                    data:'whats up'
                });
            },
            logon:function(){
                Y.io('/mod/logon.php',{
                    method:'POST',
                    on:{complete:function(id,o){
                        var rs,
                            SALT=J.user.SALT //remember
                        ;
                        //sentry
                            if(o.responseText===''){
                                alert('logon not successful');
                                return false;
                            }
                            rs=Y.JSON.parse(o.responseText);
                            if(rs.data===undefined){
                                alert('logon not successful');
                                return false;
                            }
                        //data
                            J.user.usr=Y.J.firstRecord(rs.data);
                            J.user.SALT=SALT; //restore
                        //
                        Y.fire('j:logon');
                    }},
                    data:'logon='+cfg.node.one('.j-name').get('value')
                        +'&hash='+Y.J.js.SHA1(cfg.node.one('.j-password').get('value')+Y.J.js.SHA1(J.user.SALT))
                });
            },
            logout:function(){
                Y.io('/mod/logon.php',{
                    method:'POST',
                    on:{success:function(){
                        delete J.user.usr;
                        Y.fire('j:logout');
                    }},
                    data:'logout=yes'
                });
            },
            newAccount:function(){
                //>>>>FINISH
                alert('new account function/process not implemented yet.');
            },
        };

        listeners=function(){
            cfg.node.delegate('click',render.state,'.j-close');
            cfg.node.on('focusoutside',render.state);
            cfg.node.delegate('click',function(){
                if(this.hasClass('j-connect'   )){render.logon();}
                if(this.hasClass('j-disconnect')){io.logout();}
                if(this.hasClass('j-forgot'    )){render.forgot();}
                if(this.hasClass('j-tick'      )){
                    if(this.hasClass('j-forgotSubmit'    )){io.forgot();}
                    if(this.hasClass('j-logonSubmit'     )){io.logon();}
                    if(this.hasClass('j-newAccountSubmit')){io.newAccount();}
                }
                if(this.hasClass('j-visitor')){render.newAccount();}
            },'a');
            cfg.node.delegate('keyup',function(e){
                var name=cfg.node.one('.j-name').get('value'),
                    password=cfg.node.one('.j-password').get('value'),
                    submitOk=name!==''&&password!=='',
                    nextMonth=new Date(),
                    submitNode=cfg.node.one('.j-tick')
                ;

                //>>>>FINISH verify password will require different validation
                
                submitNode.setStyle('visibility',submitOk?'visible':'hidden');
                if(submitOk){
                    nextMonth.setMonth(nextMonth.getMonth()+1);
                    Y.Cookie.set(d.COOKIE.USERNAME,name,{path:'/',expires:nextMonth});
                    if(e.keyCode===13){submitNode.simulate('click');}
                }
            },'.j-name,.j-password');
            //valid email
                cfg.node.delegate('keyup',function(){
                    cfg.node.one('.j-tick').setStyle('visibility',Y.J.checkEmail(this.get('value'))?'visible':'hidden');
                },'.j-email');
            //custom
                Y.on('j:logout',function(){
                    clearInterval(h.heartbeat);
                    render.state();
                });
                Y.on('j:logon',function(){
                    h.heartbeat=setInterval(io.heartbeat,300000); //5mins
                    render.state();
                });
        };

        render={
            cancel:Y.J.html('btn',{action:'close',title:'cancel'}),
            forgot:function(){
                cfg.node.setContent(
                    render.cancel
                   +'forgot your account details?<br/>'
                   +'<input class="j-email" type="text" placeholder="email" title="an email will be sent enabling a new password to be set" />'
                   +Y.J.html('btn',{action:'tick',classes:'j-forgotSubmit',title:'submit'})
                );
                cfg.node.one('.j-tick').setStyle('visibility','hidden');
                cfg.node.one('.j-email').focus();
            },
            logon:function(){
                cfg.node.setContent(
                    render.cancel
                   +'logon <small><a class="j-forgot" title="forgot your password">[forgot]</a></small><br/>'
                   +'<input class="j-name" type="text" placeholder="user id" title="user id" value="'+Y.Cookie.get(d.COOKIE.USERNAME)+'" /><br/>'
                   +'<input class="j-password" type="password" placeholder="password" title="user password" />'
                   +Y.J.html('btn',{action:'tick',classes:'j-logonSubmit',title:'submit'})
                );
                cfg.node.one('.j-tick').setStyle('visibility','hidden');
                cfg.node.one(Y.Cookie.get(d.COOKIE.USERNAME)===''?'.j-name':'.j-password').focus();
            },
            newAccount:function(){
                cfg.node.setContent(
                    render.cancel
                   +'new account details<br/>'
                   +'<input class="j-name" type="text" placeholder="user id" title="user id" /><br/>'
                   +'<input class="j-password" type="password" placeholder="password" title="user password" /><br/>'
                   +'<input class="j-passwordVerify" type="password" placeholder="verify password" title="user password" />'
                   +Y.J.html('btn',{action:'tick',classes:'j-newAccountSubmit',title:'submit'})
                );
                cfg.node.one('.j-tick').setStyle('visibility','hidden');
                cfg.node.one('.j-name').focus();
            },
            state:function(){
                //if logged on
                if(J.user.usr!==undefined){
                    cfg.node.setContent(
                        '<a class="j-member" title="click to change your details">'
                       +  (J.user.usr.knownAs===''
                            ?J.user.usr.firstName
                            :J.user.usr.knownAs)
                       +'</a>&nbsp;'
                       +'<a class="j-disconnect" title="disconnect from system">[logout]</a>'
                    );
                }else{
                    cfg.node.setContent(
                        '<a class="j-visitor" title="Not logged on - click to request an account">Visitor</a>&nbsp;'
                       +'<a class="j-connect" title="connect to system">[logon]</a>'
                    );
                }
            }
        };

        cfg.node.addClass('j-logon');
        listeners();

        render.state();

    };

},'1.0 Oct 2010',{requires:['base','dd-constrain','io','node','overlay']});

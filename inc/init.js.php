<?php
/** /inc/init.js.php
 *
 * javascript initialisation
 */
namespace kc;
?>
//namespace
if(!window.KC    ){KC={};}
if(!KC.data      ){KC.data={};}         //data stores
if(!KC.env       ){KC.env={};}          //environment
if(!KC.my        ){KC.my={};}           //instantiated objects
if(!KC.rs        ){KC.rs={};}           //result sets
if(!KC.std       ){KC.std={};}          //standards
if(!KC.std.format){KC.std.format={};}   //standards
if(!KC.tmp       ){KC.tmp={};}
if(!KC.user      ){KC.user={};}         //user info
//globals
<?php
if (defined('KC_SERVER'    )) {echo 'KC.env.server    ="' , KC_SERVER     , '";' , PHP_EOL;}
if (defined('KC_FILESERVER')) {echo 'KC.env.fileserver="' , KC_FILESERVER , '";' , PHP_EOL;}
if (defined('KC_ENV_DEVICE')) {echo 'KC.env.device    ="' , KC_ENV_DEVICE , '";' , PHP_EOL;}
?>
KC.env.customEventSequence=0; //sequence to help generate unqiue custom events
//standards
KC.std.format.date    ='d MMM yyyy';
KC.std.format.dateDM  ='d MMM';
KC.std.format.dateDMY ='ddMMyy';
KC.std.format.datetime='dMMMyy h:mmtt';
KC.std.format.time    ='h:mmtt';
//user
<?php
if (isset($_SESSION[KC_MEMBER])) {
    require_once 'db/table/usr/common.php';
    $criteria = new \stdClass;
    $criteria->usrIds = array($_SESSION[KC_MEMBER]);
    $r = usr_getUsr($criteria);
    $member = firstElement($r->data);
    echo('KC.user.usr=' . json_encode($member) . ';' . PHP_EOL);
}
//Challenge Handshake AP >>>>FINISH What about using PHP mcrypt_create_iv Initialization Vector?
$seed      = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
$randomStr = '';
$seedLen   = strlen($seed) - 1;
$i         = 40;
while ($i--) {$randomStr .= substr($seed,rand(0,$seedLen),1);}
$_SESSION[KC_SALT] = $randomStr;
echo 'KC.user.SALT="' , $_SESSION[KC_SALT] , '";' , PHP_EOL;

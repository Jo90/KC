<?php
/** //inc/userData.js.php
 *
 * return user data as javascript
 *
 */
namespace j;

require_once 'userData.php';
if (isset($_SESSION[J_MEMBER])) {
    //remove password
    $data = userData();
    unset($data->user->password);
    echo('J.user=' . json_encode($data) . ';' . PHP_EOL);
}
//Challenge Handshake AP
if (!isset($_SESSION[J_SALT])) {
    //>>>>FINISH What about using PHP mcrypt_create_iv Initialization Vector?
    $seed      = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $randomStr = '';
    $seedLen   = strlen($seed) - 1;
    $i         = 40;
    while (--$i) {
        $randomStr .= substr($seed,rand(0,$seedLen),1);
    }
    $_SESSION[J_SALT] = $randomStr;
    echo 'if(!J.user){J.user={};}' ,
         'J.user.SALT="' , $_SESSION[J_SALT] , '";' , PHP_EOL;
}

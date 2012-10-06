<?php
/** /inc/userData.js.php
 *
 * return user data as javascript
 *
 * calling script must ensure init.js.php has initialised KC.user
 */
namespace kc;

require_once 'userData.php';
if (isset($_SESSION[KC_MEMBER])) {
    //remove password
    $data = userData();
    unset($data->user->password);
    echo('KC.user=' . json_encode($data) . ';' . PHP_EOL);
}
//Challenge Handshake AP
if (!isset($_SESSION[KC_SALT])) {
    //>>>>FINISH What about using PHP mcrypt_create_iv Initialization Vector?
    $seed      = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $randomStr = '';
    $seedLen   = strlen($seed) - 1;
    $i         = 40;
    while (--$i) {
        $randomStr .= substr($seed,rand(0,$seedLen),1);
    }
    $_SESSION[KC_SALT] = $randomStr;
    echo 'KC.user.SALT="' , $_SESSION[KC_SALT] , '";' , PHP_EOL;
}

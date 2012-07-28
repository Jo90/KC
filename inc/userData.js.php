<?php
/** /inc/userData.js.php
 *
 * return user data as javascript
 *
 * calling script must ensure init.js.php has initialised KC.user
 */
namespace kc;
require_once 'kc-config.php';
require_once 'userData.php';

if (isset($_SESSION[KC_MEMBER])) {
    $data = userData();
    echo PHP_EOL , 'KC.user=' , json_encode($data) , ';';
}

//Challenge Handshake AP
if (isset($_SESSION[KC_CHAP])) {
    echo PHP_EOL , 'KC.user.CHAP="' , $_SESSION[KC_CHAP] , '";';
} else {
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $randomString = '';
    $maxvalue = strlen($chars) - 1;
    $length = 40;
    for ($i=0; $i<$length; $i++) {
        $randomString .= substr($chars,rand(0,$maxvalue),1);
    }
    $_SESSION[KC_CHAP] = $randomString;
    echo PHP_EOL , 'KC.user.CHAP="' , $_SESSION[KC_CHAP] , '";';
}
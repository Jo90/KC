<?php
/** /inc/userLogon.php
 *
 */
namespace kc;

//logout
if (isset($_REQUEST['logout'])) {unset($_SESSION[KC_MEMBER]); exit;}

if (!isset($_REQUEST['logon'], $_REQUEST['hash'])) {exit;}

//logon
require_once '../db/table/usr/common.php';
$criteria = new \stdClass;
$criteria->logon = $_REQUEST['logon'];
$r = usr_getUsr($criteria);

$member = firstElement($r->data);
if (!isset($member)) {exit;}

//verify password
if (SHA1($member->password . SHA1($_SESSION[KC_SALT])) == $_REQUEST['hash']) {
    $_SESSION[KC_MEMBER] = $member->id;
    //security
    unset($member->logon);
    unset($member->password);
}
if (!isset($_COOKIE[KC_USERLOGON_REMEMBER])) {
    unset($_SESSION[KC_MEMBER]);
}
header('Content-type: application/json');
echo json_encode($r);

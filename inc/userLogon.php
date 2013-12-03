<?php //inc/userLogon.php

namespace j;

if (isset($_REQUEST['logout'])) {unset($_SESSION[J_MEMBER]); exit;}
if (!isset($_REQUEST['logon'], $_REQUEST['hash'])) {exit;}

$r = Db_Usr_Get::usr((object) array('criteria' => (object) array('logon' => $_REQUEST['logon'])));

if (!isset($r->data)) {exit;}
$member = firstElement($r->data);

if (!isset($member)) {exit;}

//verify password
if (SHA1($member->password . SHA1($_SESSION[J_SALT])) == $_REQUEST['hash']) {
    $_SESSION[J_MEMBER] = $member->id;
    //security
    unset($member->logon);
    unset($member->password);
} else exit;
if (!isset($_COOKIE[J_USERLOGON_REMEMBER])) {
    unset($_SESSION[J_MEMBER]);
}
header('Content-type: application/json');
echo json_encode($r);

<?php
/** /inc/userLogon.php
 *
 */
require_once 'kc-config.php';
/**
 *  logout
 */
if (isset($_REQUEST['logout'])) {
    unset($_SESSION[KC_MEMBER]);
    exit;
}

$mysqli = $registry->db->db2->link;
$data = new \stdClass;

/**
 *  logon
 */
if (!isset($_REQUEST['logon'], $_REQUEST['password'])) {exit;}

$memberLogonExists = false;
if ($stmt = $mysqli->prepare(
    "select *
       from `member`
      where logon = ?"
)) {
    $stmt->bind_param('s'
       ,$_REQUEST['logon']
    );
    $memberLogonExists = $stmt->execute();
    $memberData = \kc\fetch_result($stmt);
    $stmt->close();
}
/**
 *  verify password
 */
if ($memberLogonExists && SHA1($memberData[0]->password . SHA1($_SESSION[KC_CHAP])) == $_REQUEST['password']) {

    require_once 'userData.php';

    $_SESSION[KC_MEMBER] = $memberData[0]->contact;
    $data = userData();
}
if (!isset($_COOKIE[KC_USERLOGON_REMEMBER])) {
    unset($_SESSION[KC_MEMBER]);
}

header('Content-type: application/json');
exit(json_encode($data));

<?php
/** /db/grpUsr/u.php
 *
 *  Kauri Coast Promotion Society
 *
 */
namespace kc;
require_once '../grp/common.php';

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {
    grp_setGrpUsr($i);
}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($post);

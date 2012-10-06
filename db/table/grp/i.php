<?php
/** /db/grp/i.php
 *
 *  Kauri Coast Promotion Society
 *
 */
namespace kc;
require_once 'common.php';

$post = json_decode(file_get_contents('php://input'));
if (!isset($post)) {exit('{"error":"insufficient parameters"}');}

foreach ($post as $i) {
    if (!isset($i->data, $i->data->name)) {continue;}
    grp_setGrp($i);
}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($post);

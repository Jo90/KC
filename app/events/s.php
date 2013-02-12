<?php
/** /db/app/events/s.php
 *
 *  Kauri Coast Promotion Society
 *
 */
namespace kc;
require_once '../../table/tag/common.php';
require_once '../../table/usr/common.php';
$post = json_decode(file_get_contents('php://input'));
if (!isset($post)) {exit('{"error":"insufficient parameters"}');}

foreach ($post as $i) {

    if (!isset($i->criteria)) {continue;}
    $i->result = new \stdClass;
    $r = $i->result;

    $r->grp = grp_getGrp((object)array('grpIds'=>array(1,2,3,4,5)));



}
header('Content-type: text/plain');
echo json_encode($post);

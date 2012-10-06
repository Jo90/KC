<?php
/** /db/table/usr/s.php
 *
 *  Kauri Coast Promotion Society
 *
 */
namespace kc;
require_once 'common.php';
require_once '../grp/common.php';
require_once '../tg/common.php';

$post = json_decode(file_get_contents('php://input'));
if (!isset($post)) {exit('{"error":"insufficient parameters"}');}

foreach ($post as $i) {
    if (!isset($i->criteria, $i->criteria->usrIds)) {continue;}
    $i->result = new \stdClass;
    $r         = $i->result;
    $r->usr    = usr_getUsr($i->criteria);
    $r->usrTags = tg_getLink((object) array('dbTable' => $dbTable['usr'],'pks' => $i->criteria->usrIds));
    $r->usrInfo = usr_getUsrInfo($i->criteria);
    $r->grpUsr  = grp_getGrpUsr($i->criteria);
}
header('Content-type: text/plain');
echo json_encode($post);

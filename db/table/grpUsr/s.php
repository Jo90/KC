<?php
/** /db/grpUsr/s.php
 *
 *  Kauri Coast Promotion Society
 *
 */
namespace kc;
require_once '../grp/common.php';
require_once '../tg/common.php';
require_once '../usr/common.php';

$post = json_decode(file_get_contents('php://input'));
if (!isset($post)) {exit('{"error":"insufficient parameters"}');}

foreach ($post as $i) {

    if (!isset($i->criteria)) {continue;} //can pass grpIds OR usrIds to grp_getGrpUsr

    $i->result = new \stdClass;
    $r         = $i->result;

    $r->grpUsr = grp_getGrpUsr($i->criteria);
    //reinitialize
    $i->criteria->grpIds = array();
    $i->criteria->usrIds = array();
    foreach ($r->grpUsr->data as $v) {
        $i->criteria->grpIds[] = $v->grp;
        $i->criteria->usrIds[] = $v->usr;
    };
    $r->grp               = grp_getGrp($i->criteria);
    $r->grpInfo           = grp_getGrpInfo($i->criteria);
    $r->usr               = usr_getUsr($i->criteria);
    $i->criteria->dbTable = 1; //dbtable grp
    $i->criteria->pks     = $i->criteria->grpIds;
    $r->grpTags           = tg_getLink($i->criteria);
}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($post);

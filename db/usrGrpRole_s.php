<?php //db/usrGrpRole_s.php

namespace j;

$post = json_decode(file_get_contents('php://input'));
if (!isset($post)) {exit('{"error":"insufficient parameters"}');}

foreach ($post as $i) {

    if (!isset($i->criteria)) {continue;} //can pass grpIds OR usrIds to grp_getGrpUsr

    $r = Core::initResult($i);

    $r->usrGrpRole = Db_Usr::getUsrGrpRole($i);
    //reinitialize
    $i->criteria->grpIds = array();
    $i->criteria->usrIds = array();
    foreach ($r->grpUsr->data as $v) {
        $i->criteria->grpIds[] = $v->grp;
        $i->criteria->usrIds[] = $v->usr;
    };
    $r->grp     = Db_Grp::getGrp($i);
    $r->grpInfo = Db_Grp::getGrpInfo($i);
    $r->usr     = Db_Usr::getUsr($i);
}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($post);

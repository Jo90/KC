<?php //db/grp_s.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {

    $r = Core::initResult($i);
    $i->criteria = isset($i->criteria) ? $i->criteria : new \stdClass;
    $c = $i->criteria;

    //if requested get usrGrpRole
    if (isset($c->usrGrpRoleIds)) {
        $r->usrGrpRole = Db_Usr::getUsrGrpRole($i);
        //reinitialize
        $c->grpIds = array();
        $c->usrIds = array();
        foreach ($r->usrGrpRole->data as $v) {
            $c->grpIds[] = $v->grp;
            $c->usrIds[] = $v->usr;
        };
    }

    $r->grp = Db_Grp::getGrp($i);

    //if criteria->grpIds empty get returned grps
    if (count($i->criteria->grpIds)==0) {
        foreach ($r->grp->data as $v) {$i->criteria->grpIds[] = $v->id;};
    }
/*
    $r->grpTags = tg_getLink((object) array('dbTable' => $dbTable['grp'],'pks' => $i->criteria->grpIds));
    $r->grpInfo = info_getInfo((object) array('dbTable' => $dbTable['grp'],'pks' => $i->criteria->grpIds));
    $r->grpUsr  = grp_getGrpUsr($i->criteria);
    if (isset($r->grpUsr->data) && count($r->grpUsr->data)>0) {
        foreach ($r->grpUsr->data as $v) {$i->criteria->usrIds[] = $v->usr;};
        $r->usr = usr_getUsr($i->criteria);
    }
*/
}
header('Content-type: text/plain');
echo json_encode($post);

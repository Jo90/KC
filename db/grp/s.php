<?php //db/grp/s.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {

    $i->log    = array();
    //can pass grpIds OR usrIds to grp_getGrpUsr
    if (!isset($i->criteria) && (!isset($i->criteria->grpIds) && !isset($i->criteria->usrIds))) {$r->log[] = 'invalid parameters'; continue;}
    $i->result = new \stdClass;
    $r         = $i->result;

    //if requested get grpUsr
    if (!isset($i->criteria->grpIds) && isset($i->criteria->usrIds)) {
        $r->grpUsr = db_grp_getGrpUsr($i->criteria);
        //reinitialize
        $i->criteria->grpIds = array();
        $i->criteria->usrIds = array();
        foreach ($r->grpUsr->data as $v) {
            $i->criteria->grpIds[] = $v->grp;
            $i->criteria->usrIds[] = $v->usr;
        };
    }
    if (!isset($i->criteria->grpIds)) {$r->log[] = 'no grp ids'; continue;}

    $r->grp = db_grp_getGrp($i->criteria);
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

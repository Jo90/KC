<?php //db/usr_s.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {

    if (!isset($i) &&
        !isset($i->criteria) &&
        !isset($i->criteria->usrIds)
    ) {continue;}

    //shortcuts
        $r = Core::initResult($i);
        $c = $i->criteria;

    $r->usr = Db_Usr::getUsr($i);

    $r->usrAddress = Db_Usr::getUsrAddress($i);
/*
    if (isset($r->usrAddress->data) && (count(get_object_vars($r->usrAddress->data)) > 0)) {
        foreach ($r->usrAddress->data as $d) {$c->addressIds[] = $d->address;}
        $r->address = Db_Get::address($i->usr);
        $c->locationIds = array();
        foreach ($r->address->data as $d) {$c->locationIds[] = $d->location;}
        $r->location = Db_Get::location($i->usr);
    }

    $r->usrInfo = Db_Usr::getUsrInfo($i->usr);

    $r->usrGrpRole = Db_Usr::getUsrGrpRole($i->usr); //get specified users groups
    if (isset($r->usrGrp->data) && (count(get_object_vars($r->usrGrp->data)) > 0)) {

        //get groups
        $c->grpIds = array();
        foreach ($r->usrGrp->data as $d) {$c->grpIds[] = $d->grp;}
        $c->grpIds = array_values(array_unique($c->grpIds));

        //fetch groups from grpIds
        $r->grp = Db_Grp::getGrp($i->usr);

        //fetch all usrGrp records for grpIds
        $r->usrGrp = Db_Usr::getUsrGrp((object) array('criteria' => (object) array('grpIds' => $c->grpIds)));
        foreach ($r->usrGrp->data as $d) {$c->usrIds[] = $d->usr;}
        $c->usrIds = array_values(array_unique($c->usrIds));

        //fetch users from usrIds
        $r->usr = Db_Usr::getUsr($i->usr);
    }
*/
}
header('Content-type: text/plain');
echo json_encode($post);

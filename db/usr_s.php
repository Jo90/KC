<?php //db/usr_s.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {

    $r = Core::initResult($i);
    $c = $i->criteria;

    $r->usr         = Db_Usr::getUsr($i);
    $r->address     = Db_Core::getAddress((object) array('criteria' => (object) array('dbTable' => 'usr', 'pk' => $i->criteria->usrIds[0])));
    //usr address
    if (isset($r->address->data) && (count(get_object_vars($r->address->data)) > 0)) {
        $c->locationIds = array();
        foreach ($r->address->data as $d) {$c->locationIds[] = $d->location;}
        $r->location = Db_Core::getLocation($i);
    }

    $r->info    = Db_Core::getInfo((object) array('criteria' => (object) array('dbTable' => 'usr', 'pk' => $c->usrIds[0])));
    $r->usrTags = Db_Core::getTag((object)  array('criteria' => (object) array('dbTable' => 'usr', 'pk' => $c->usrIds[0])));

    $r->member = Db_Usr::getMember((object)  array('criteria' => (object) array('dbTable' => 'usr', 'pk' => $c->usrIds[0])));
    //member grp
    if (isset($r->member->data) && (count(get_object_vars($r->member->data)) > 0)) {
        $c->grpIds = array();
        $c->memberIds = array();
        foreach ($r->member->data as $d) {
            $c->grpIds[] = $d->grp;
            $c->memberIds[] = $d->id;
        }
        $r->grp  = Db_Core::getGrp($i);
        $r->role = Db_Usr::getRole($i);
    }
    //grp tags
    $r->grpTags = Db_Core::getTag((object)  array('criteria' => (object) array('dbTable' => 'grp', 'pk' => $c->grpIds)));
    
/*

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

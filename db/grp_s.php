<?php //db/grp_s.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {

    $r = Core::initResult($i);
    $c = $i->criteria;

    $r->grp = Db_Core::getGrp($i);

    //tags
    if (isset($r->grp->data) && (count(get_object_vars($r->grp->data)) > 0)) {
        $c->grpIds = array();
        foreach ($r->grp->data as $d) {$c->grpIds[] = $d->id;}
        $r->tag  = Db_Core::getTag((object) array('criteria' => (object) array('dbTable' => 'grp', 'pk' => $c->grpIds)));
        $r->info = Db_Core::getInfo((object) array('criteria' => (object) array('dbTable' => 'grp', 'pk' => $c->grpIds)));
    }
    if(isset($c->detailed) && $c->detailed){
        $r->member = Db_Usr::getMember((object) array('criteria' => (object) array('grpIds' => $c->grpIds)));
        $c->memberIds = array();
        $c->usrIds = array();
        foreach ($r->member->data as $d) {
            $c->memberIds[] = $d->id;
            if($d->dbTable == 'usr'){
                $c->usrIds[] = $d->pk;
            }
        }
        $r->role = Db_Usr::getRole((object) array('criteria' => (object) array('memberIds' => $c->memberIds)));
        $r->usr  = Db_Usr::getUsr($i);
    }
}
header('Content-type: text/plain');
echo json_encode($post);

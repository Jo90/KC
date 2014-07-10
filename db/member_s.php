<?php //db/member_s.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {

    $r = Core::initResult($i);
    $c = $i->criteria;

    $r->member = Db_Usr::getMember($i);
    //roles
    if (isset($r->member->data) && (count(get_object_vars($r->member->data)) > 0)) {
        $c->member = array();
        foreach ($r->member->data as $d) {$c->member[] = $d->id;}
        $r->role = Db_Usr::getRole($i);
    }
}
header('Content-type: text/plain');
echo json_encode($post);

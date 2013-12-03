<?php //db/info/s.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {

    $i->log    = array();
//>>>>FINISH criteria
    if (!isset($i->criteria) && !isset($i->criteria->infoIds)) {$r->log[] = 'invalid parameters'; continue;}
    $i->result = new \stdClass;
    $r         = $i->result;

    $r->info = db_getInfo($i->criteria);
}
header('Content-type: text/plain');
echo json_encode($post);

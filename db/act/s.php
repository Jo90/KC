<?php //db/act/s.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {

    if (!isset($i->act) &&
        !isset($i->act->criteria) &&
        !isset($i->act->criteria->actIds)
    ) {continue;}

    $r = initResult($i);
    $c = $i->act->criteria;

    $r->act = Db_Act_Get::act($i);

    //get related





}
header('Content-type: text/plain');
echo json_encode($post);

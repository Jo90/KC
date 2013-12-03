<?php //db/grp/i.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {
    if (!isset($i->data, $i->data->name)) {continue;}
    db_grp_setGrp($i);
    db_grp_setGrpUsr($i);
}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($post);

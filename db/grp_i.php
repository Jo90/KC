<?php //db/grp_i.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {
    if (!isset($i->data, $i->data->name)) {continue;}
    Db::set('grp',$i);
    Db::set('grpUsr',$i);
}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($post);

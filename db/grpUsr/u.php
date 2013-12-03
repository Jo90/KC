<?php //db/grpUsr/u.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {
    db_set('grpUsr',$i);
}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($post);

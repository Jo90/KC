<?php //db/usrGrpRole_u.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {
    Db::set('usrGrpRole',$i);
}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($post);

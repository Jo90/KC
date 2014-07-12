<?php //db/role_u.php

namespace j;

$post = json_decode(file_get_contents('php://input'));
if (!isset($post)) {exit('{"error":"insufficient parameters"}');}

foreach ($post as $i) {

    Db::set('role', $i->role);

}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($post);

<?php //db/memberRole_i.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {
    if (!isset($i->member, $i->member->records)) {continue;}

    Db::set('member', $i->member);

    foreach ($i->member->records as $ix) {
        if ($ix->insert) {
            foreach ($ix->children->role->records as $ic) {
                $ic->data->member = $ix->data->id;
                Db::set('role',$ix->children->role);
            }
        }
    }
}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($post);

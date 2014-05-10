<?php //db/grp/u.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {

    if (!isset($i->criteria, $i->criteria->usr)) {continue;}

    foreach ($i->criteria->usr as $ix) {
        if (!isset($ix->data)) {continue;}
        Db::set('usr',$ix);
        foreach ($ix->children->usrInfo as $ic) {Db::set('usrInfo',$ic);}
    }
}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($post);

<?php //db/grp_u.php

namespace j;

$post = json_decode(file_get_contents('php://input'));
if (!isset($post)) {exit('{"error":"insufficient parameters"}');}

foreach ($post as $i) {
    if (!isset($i->criteria, $i->criteria->grp)) {continue;}
    foreach ($i->criteria->grp as $ix) {
        if (!isset($ix->data)) {continue;}
        Db::set('grp',$ix);
        foreach ($ix->children->grpInfo as $ic) {
            //cascade grp
            $ic->data->grp = $ix->data->id;
            Db::set('grpInfo',$ic);
        }
/*
        foreach ($ix->children->tgLink  as $ic) {
            //cascade grp
            $ic->data->pk = $ix->data->id;
            tg_setLink($ic);
        }
*/
    }
}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($post);

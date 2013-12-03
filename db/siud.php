<?php //db/siud.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {
    foreach ($i as $key => $dataSet) {

        $criteria = isset($dataSet->criteria) && $r = initResult($dataSet);

        if ($criteria) switch ($key) {
            case 'act'       : $r->{$key} = db_act_getAct       ($dataSet); break;
            case 'address'   : $r->{$key} = db_getAddress       ($dataSet); break;
            case 'grp'       : $r->{$key} = db_grp_getGrp       ($dataSet); break;
            case 'event'     : $r->{$key} = db_getEvent         ($dataSet); break;
            case 'info'      : $r->{$key} = db_getInfo          ($dataSet); break;
            case 'usr'       : $r->{$key} = db_usr_getUsr       ($dataSet); break;
            case 'usrAddress': $r->{$key} = db_usr_getUsrAddress($dataSet); break;
            case 'usrGrpRole': $r->{$key} = db_usr_getUsrGrpRole($dataSet); break;
            case 'usrInfo'   : $r->{$key} = db_usr_getUsrInfo   ($dataSet); break;
        }
        else db_set($key, $dataSet);
    }
}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($post);
<?php //db/siud.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {
    foreach ($i as $key => $dataSet) {

        $criteria = isset($dataSet->criteria) && $r = Core::initResult($dataSet);

        if ($criteria) switch ($key) {
            case 'act'       : $r->{$key} = Db_Act ::getAct       ($dataSet); break;
            case 'address'   : $r->{$key} = Db_Core::getAddress   ($dataSet); break;
            case 'grp'       : $r->{$key} = Db_Grp ::getGrp       ($dataSet); break;
            case 'info'      : $r->{$key} = Db_Core::getInfo      ($dataSet); break;
            case 'usr'       : $r->{$key} = Db_Usr ::getUsr       ($dataSet); break;
        }
        else Db::set($key, $dataSet);
    }
}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($post);
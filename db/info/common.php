<?php //db/info/common.php

namespace j;

function db_getInfo($criteria) {
    global $mysqli;
    $r = new \stdClass;
    $r->criteria = $criteria;
    $cnd = '';
    if (isset($criteria->infoIds) && is_array($criteria->infoIds) && count($criteria->infoIds) > 0) {
        $infoIds = implode(',', $criteria->infoIds);
        $cnd = "where id in ($infoIds)";
    }
    if (isset($criteria->dbTable, $criteria->pks) && is_array($criteria->pks) && count($criteria->pks) > 0) {
        $pks   = implode(',', $criteria->pks);
        $dbTab = $criteria->dbTable;
        $cnd = "where dbTable = $dbTab and pk in ($pks)";
    }
    if ($stmt = $mysqli->prepare(
        "select *
           from `info` $cnd"
    )) {
        $r->success = $stmt->execute();
        $r->rows = $mysqli->affected_rows;
        $r->data = \j\fetch_result($stmt);
        $stmt->close();
    }
    return $r;
}

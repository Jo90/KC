<?php //class/db/grp.php

namespace j;

class Db_Grp extends Db {

    public static function getGrp($i, $extend = false) {
        global $mysqli;

        $r = $extend ? initResult($i) : new \stdClass;
        $i->criteria = isset($i->criteria) ? $i->criteria : new \stdClass;
        $c = $i->criteria;

        $where   = '';
        $limit   = '';
        $orderBy = '1 desc';

        if (isset($c->grpIds) && is_array($c->grpIds) && count($c->grpIds) > 0) {$where = 'where id in (' . implode(',', $c->grpIds) . ')';}
        if (isset($c->rowLimit)) {$limit = ' limit ' . $c->rowLimit;}
        if (isset($c->orderBy)) {$orderBy = $mysqli->real_escape_string($c->orderBy);}

        if ($stmt = $mysqli->prepare(
            "select * from `grp` $where order by $orderBy $limit"
        )) {
            $r->success = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->data = Core::fetch_result($stmt,'id');
            $stmt->close();
        }
        return $r;
    }
}

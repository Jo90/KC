<?php //class/db/act.php

namespace j;

class Db_Act extends Db {

    public static function getAct($i, $extend = false) {
        global $mysqli;

        $r = $extend ? initResult($i) : new \stdClass;
        $c = $i->criteria;

        if (!isset($c)) {return null;}

        $cnd     = '1=1';
        $limit   = '';
        $orderBy = 'order by 1 desc'

        if (isset($c->actIds) && is_array($criteria->actIds) && count($criteria->actIds) > 0) {
            $cnd  = 'id in (' . implode(',', $c->actIds) . ')';
        }

        if (isset($c->limit))   {$limit = ' limit ' . $c->limit;}
        if (isset($c->orderBy)) {$orderBy = 'order by ' . $mysqli->real_escape_string($c->orderBy);}

        if (!isset($c->orderBy)) {$c->orderBy = '';}
        $cnd .= $mysqli->real_escape_string($criteria->orderBy);

        if ($stmt = $mysqli->prepare(
            "select *
               from `act` $cnd
              where $cnd $orderBy $limit"
        )) {
            $r->success = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->data = Core::fetch_result($stmt,'id');
            $stmt->close();
        }
        return $r;
    }
}

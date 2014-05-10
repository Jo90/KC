<?php //class/db/core.php

namespace j;

class Db_Core extends Db {

    public static function getEvent($i, $extend = false) {
        global $mysqli;

        $r = $extend ? initResult($i) : new \stdClass;
        $c = $i->criteria;

        $cnd = "";

        if (isset($c->eventIds) && is_array($c->eventIds) && count($c->eventIds) > 0) {
            $eventIds = implode(',', $c->eventIds);
            $cnd = "where id in ($eventIds)";
        }else
        if (isset($c->addressIds) && is_array($c->addressIds) && count($c->addressIds) > 0) {
            $addressIds = implode(',', $c->addressIds);
            $cnd = "where address in ($addressIds)";
        }else
        if (isset($c->jobIds) && is_array($c->jobIds) && count($c->jobIds) > 0) {
            $jobIds = implode(',', $c->jobIds);
            $cnd = "where job in ($jobIds)";
        }
        if ($stmt = $mysqli->prepare(
            "select *
            from `event` $cnd"
        )) {
            $r->success = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->data = Core::fetch_result($stmt,'id');
            $stmt->close();
        }
        return $r;
    }

    public static function getGrp($i, $extend = false) {
        global $mysqli;

        $r = $extend ? initResult($i) : new \stdClass;
        $c = $i->criteria;

        $cnd = "";

        if (isset($c->grpIds) && is_array($c->grpIds) && count($c->grpIds) > 0) {
            $ids = implode(',', $c->grpIds);
            $cnd = "where id in ($ids)";
        }
        if ($stmt = $mysqli->prepare(
            "select *
            from `grp` $cnd"
        )) {
            $r->success = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->data = Core::fetch_result($stmt,'id');
            $stmt->close();
        }
        return $r;
    }

    public static function getInfo($i, $extend = false) {
        global $mysqli;

        $r = $extend ? initResult($i) : new \stdClass;
        $c = $i->criteria;

        if (!isset($c)) {return null;}

        $cnd     = '1=1';
        $limit   = '';
        $orderBy = 'order by 1 desc'

        if (isset($c->infoIds) && is_array($criteria->infoIds) && count($criteria->infoIds) > 0) {
            $cnd  = 'id in (' . implode(',', $c->infoIds) . ')';
        }

        if (isset($c->rowLimit)) {
            $limit = ' limit ' . $c->rowLimit;
        }

        if (!isset($c->orderBy)) {$c->orderBy = '';}
        $cnd .= $mysqli->real_escape_string($criteria->orderBy);

        if ($stmt = $mysqli->prepare(
            "select *
               from `info` $cnd
              where $cnd $limit $orderBy"
        )) {
            $r->success = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->data = Core::fetch_result($stmt,'id');
            $stmt->close();
        }
        return $r;
    }

}

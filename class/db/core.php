<?php //class/db/core.php

namespace j;

class Db_Core extends Db {

    public static function getAddress($i, $extend = false) {
        global $mysqli;

        $r = $extend ? initResult($i) : new \stdClass;
        $c = $i->criteria;

        $cnd     = '1=1';
        $limit   = '';
        $orderBy = 'order by 1 desc';

        if (isset($c->addressIds) && is_array($c->addressIds) && count($c->addressIds) > 0) {
            $cnd  = 'id in (' . implode(',', $c->addressIds) . ')';
        } else if (isset($c->dbTable, $c->pk)) {
            $cnd  = "`dbTable` = '$c->dbTable' and `pk` = $c->pk";
        }

        if (isset($c->limit))   {$limit = ' limit ' . $c->limit;}
        if (isset($c->orderBy)) {$orderBy = $mysqli->real_escape_string($c->orderBy);}

        if ($stmt = $mysqli->prepare(
            "select *
               from `address`
              where $cnd $orderBy $limit"
        )) {
            $r->success = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->data = Core::fetch_result($stmt,'id');
            $stmt->close();
        }
        return $r;
    }

    public static function getEvent($i, $extend = false) {
        global $mysqli;

        $r = $extend ? initResult($i) : new \stdClass;
        $c = $i->criteria;

        $cnd     = '1=1';
        $limit   = '';
        $orderBy = 'order by 1 desc';

        if (isset($c->eventIds) && is_array($c->eventIds) && count($c->eventIds) > 0) {
            $eventIds = implode(',', $c->eventIds);
            $cnd = "`id` in ($eventIds)";
        }else
        if (isset($c->addressIds) && is_array($c->addressIds) && count($c->addressIds) > 0) {
            $addressIds = implode(',', $c->addressIds);
            $cnd = "`address` in ($addressIds)";
        }else
        if (isset($c->jobIds) && is_array($c->jobIds) && count($c->jobIds) > 0) {
            $jobIds = implode(',', $c->jobIds);
            $cnd = "`job` in ($jobIds)";
        }
        if (isset($c->limit))   {$limit = ' limit ' . $mysqli->real_escape_string($c->limit);}
        if (isset($c->orderBy)) {$orderBy = $mysqli->real_escape_string($c->orderBy);}

        if ($stmt = $mysqli->prepare(
            "select *
               from `event`
              where $cnd $orderBy $limit"
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

        $cnd     = '';
        $limit   = '';
        $orderBy = 'order by `name`';

        if (isset($c->grpIds) && is_array($c->grpIds) && count($c->grpIds) > 0) {
            $ids = implode(',', $c->grpIds);
            $cnd = "`id` in ($ids)";
        } else if (isset($c->restrict)) {
            $cnd = '`restrict` = ' . $mysqli->real_escape_string($c->restrict);
        }
        if (isset($c->limit))   {$limit = ' limit ' . $mysqli->real_escape_string($c->limit);}
        if (isset($c->orderBy)) {$orderBy = 'order by ' . $mysqli->real_escape_string($c->orderBy);}

        if ($stmt = $mysqli->prepare(
            "select *
               from `grp`
              where $cnd $orderBy $limit"
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
        $orderBy = 'order by `seq`';

        if (isset($c->infoIds) && is_array($c->infoIds) && count($c->infoIds) > 0) {
            $cnd  = '`id` in (' . implode(',', $c->infoIds) . ')';
        } else
        if (isset($c->dbTable, $c->pk)) {
            $cnd  = "`dbTable` = '$c->dbTable' and `pk` " .
                (is_array($c->pk)
                 ?'in (' . implode(',', $c->pk) . ')'
                 :"= $c->pk");
        }

        
        if (isset($c->limit))   {$limit = ' limit ' . $mysqli->real_escape_string($c->limit);}
        if (isset($c->orderBy)) {$orderBy = 'order by ' . $mysqli->real_escape_string($c->orderBy);}

        if ($stmt = $mysqli->prepare(
            "select *
               from `info`
              where $cnd $orderBy $limit"
        )) {
            $r->success = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->data = Core::fetch_result($stmt,'id');
            $stmt->close();
        }
        return $r;
    }

    public static function getLocation($i, $extend = false) {
        global $mysqli;

        $r = $extend ? initResult($i) : new \stdClass;
        $c = $i->criteria;

        if (!isset($c)) {return null;}

        $cnd     = '1=1';
        $limit   = '';
        $orderBy = 'order by `name`';

        if (isset($c->locationIds) && is_array($c->locationIds) && count($c->locationIds) > 0) {
            $cnd  = 'id in (' . implode(',', $c->locationIds) . ')';
        }
        if (isset($c->limit))   {$limit = ' limit ' . $mysqli->real_escape_string($c->limit);}
        if (isset($c->orderBy)) {$orderBy = 'order by ' . $mysqli->real_escape_string($c->orderBy);}

        if ($stmt = $mysqli->prepare(
            "select *
               from `location`
              where $cnd $orderBy $limit"
        )) {
            $r->success = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->data = Core::fetch_result($stmt,'id');
            $stmt->close();
        }
        return $r;
    }

    public static function getTag($i) {
        global $mysqli;

        $c = $i->criteria;

        $cnd     = '1=1';
        $limit   = '';
        $orderBy = 'order by `category`,`seq`';

        if (isset($c->dbTable, $c->pk)) {
            $cnd  = "`dbTable` = '$c->dbTable' and `pk` " .
                (is_array($c->pk)
                 ?'in (' . implode(',', $c->pk) . ')'
                 :"= $c->pk");
        }

        if (isset($c->limit))   {$limit = ' limit ' . $mysqli->real_escape_string($criteria->limit);}
        if (isset($c->orderBy)) {$orderBy = 'order by ' . $mysqli->real_escape_string($c->orderBy);}

        if ($stmt = $mysqli->prepare(
            "select *
               from `tag`
              where $cnd $orderBy $limit"
        )) {
            $r->success = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->data = Core::fetch_result($stmt);
            $stmt->close();
        }
        return $r;
    }

}

<?php /* //class/db/usr.php */

namespace j;

class Db_Usr extends Db {

    public static function getMember($i, $extend = false) {
        global $mysqli;

        $r = $extend ? initResult($i) : new \stdClass;
        $c = $i->criteria;

        $cnd     = '1=1';
        $limit   = '';
        $orderBy = '';

        if (isset($c->memberIds) && is_array($c->memberIds) && count($c->memberIds) > 0) {
            $cnd  = 'id in (' . implode(',', $c->memberIds) . ')';
        } else if (isset($c->dbTable, $c->pk)) {
            $cnd  = "`dbTable` = '$c->dbTable' and `pk` = $c->pk";
        }

        if (isset($c->limit))   {$limit = ' limit ' . $c->limit;}
        if (isset($c->orderBy)) {$orderBy = 'order by' . $mysqli->real_escape_string($c->orderBy);}

        if ($stmt = $mysqli->prepare(
            "select *
               from `member`
              where $cnd $orderBy $limit"
        )) {
            $r->success = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->data = Core::fetch_result($stmt,'id');
            $stmt->close();
        }
        return $r;
    }

    public static function getRole($i, $extend = false) {
        global $mysqli;

        $r = $extend ? initResult($i) : new \stdClass;
        $c = $i->criteria;

        $cnd     = '1=1';
        $limit   = '';
        $orderBy = '';

        if (isset($c->roleIds) && is_array($c->roleIds) && count($c->roleIds) > 0) {
            $cnd  = 'id in (' . implode(',', $c->roleIds) . ')';
        } else if (isset($c->member)) {
            $cnd  = "`member` " .
                (is_array($c->member)
                 ?'in (' . implode(',', $c->member) . ')'
                 :"= $c->member");
        }

        if (isset($c->limit))   {$limit = ' limit ' . $c->limit;}
        if (isset($c->orderBy)) {$orderBy = 'order by' . $mysqli->real_escape_string($c->orderBy);}

        if ($stmt = $mysqli->prepare(
            "select *
               from `role`
              where $cnd $orderBy $limit"
        )) {
            $r->success = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->data = Core::fetch_result($stmt,'id');
            $stmt->close();
        }
        return $r;
    }

    public static function getUsr($i, $extend = false) {
        global $mysqli;

        $r = $extend ? Core::initResult($i) : new \stdClass;
        $c = $i->criteria;

        if (!isset($c)) {return null;}

        $cnd     = '';
        $cols    = '`id`,`created`,`title`,`firstName`,`lastName`,`knownAs`';
        $limit   = '';
        $orderBy = '';

        if (isset($c->usrIds)) {
            $cnd  = 'id in (' . implode(',', $c->usrIds) . ')';
        } else
        if (isset($c->logon)) {
            $cols = '*';
            $cnd  = 'logon = "' . $mysqli->real_escape_string($c->logon) . '"';
        } else
        if (isset($c->firstName, $c->lastName)) {
            $cnd  = 'firstName like "' . $mysqli->real_escape_string($c->firstName) . '%" and '
                . 'lastName like "'  . $mysqli->real_escape_string($c->lastName) . '%"';
        }

        if (isset($c->limit))   {$limit = ' limit ' . $c->limit;}
        if (isset($c->orderBy)) {$orderBy = 'order by' . $mysqli->real_escape_string($c->orderBy);}

        if ($stmt = $mysqli->prepare(
            "select $cols
               from `usr`
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
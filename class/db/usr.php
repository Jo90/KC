<?php /* //class/db/usr.php */

namespace j;

class Db_Usr extends Db {

    public static function getUsr($i, $extend = false) {
        global $mysqli;

        $r = $extend ? Core::initResult($i) : new \stdClass;
        $c = $i->criteria;

        if (!isset($c)) {return null;}

        $cnd   = '';
        $cols  = '`id`,`created`,`title`,`firstName`,`lastName`,`knownAs`';
        $limit = '';

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

        if (isset($c->rowLimit)) {
            $limit = ' limit ' . $c->rowLimit;
        }

        if ($stmt = $mysqli->prepare(
            "select $cols
               from `usr`
              where $cnd $limit"
        )) {
            $r->success = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->data = Core::fetch_result($stmt,'id');
            $stmt->close();
        }
        return $r;
    }

}
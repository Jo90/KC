<?php //db/base.php

namespace j;

class Db {

    /**
     *  Generic insert,update,delete
     */
    public static function set($tab,&$i) {
        global $mysqli;
        Db::remove($tab, $i);
        if (isset($i->record)) {
            foreach ($i->record as $rec) {
                Db::update($tab,$rec) or Db::insert($tab,$rec);
            }
        }
    }

    public static function insert($table, &$i) {
        global $mysqli;

        $fieldBind  = array();
        $fieldInfo  = array();
        $fieldPlace = array();
        $fieldSet   = array();
        $fieldTypes = '';
        $parameters = array();
        $results    = array();

        if (!($i->insert = isset($i->data))) {return false;}

        $r = initResult($i);

        $stmt = $mysqli->prepare("show columns from `$table`") or die("Problem finding columns in `$table`");
        $stmt->execute();
        $meta = $stmt->result_metadata();
        while ($field = $meta->fetch_field()) {
            $parameters[] = &$row[$field->name];
        }
        call_user_func_array(array($stmt, 'bind_result'), $parameters);

        $fieldBind  = array();
        $fieldNames = array();
        $fieldTypes = '';
        while ($stmt->fetch()) {
            $fieldInfo = array();
            foreach ($row as $key => $val) {$fieldInfo[$key] = $val;}
            $results[] = $fieldInfo;

            if ($fieldInfo['Key'] != 'PRI' && isset($i->data->{$fieldInfo['Field']})) {

                $fieldNames[]   = $fieldInfo['Field'];
                $fieldMarkers[] = '?';
                $fieldBind[]    = '$i->data->' . $fieldInfo['Field'];

                //>>>>>FINISH all types???????
                if ($fieldInfo['Type'] == 'text' || strpos($fieldInfo['Type'], 'char') !== false) {$fieldTypes .= 's';}
                else if (strpos($fieldInfo['Type'], 'int') !== false) {$fieldTypes .= 'i';}
                else {$fieldTypes .= 'd';}
            }
        }
        $fieldBind    =       implode(','  , $fieldBind   );
        $fieldMarkers =       implode(','  , $fieldMarkers);
        $fieldNames   = '`' . implode('`,`', $fieldNames  ) . '`';
        //>>>>FINISH naughty eval, FUTURE bind correctly
        eval(
            "if (\$stmt = \$mysqli->prepare(
                \"insert into  `$table` ($fieldNames) values ($fieldMarkers)\"
             )) {
                \$stmt->bind_param('$fieldTypes',
                    $fieldBind
                );
                \$r->successInsert = \$stmt->execute();
                \$r->rows = \$mysqli->affected_rows;
                \$r->successInsert
                    ?\$i->data->id    = \$stmt->insert_id
                    :\$r->errorInsert = \$mysqli->error;
                \$stmt->close();
            }"
        );
    }

    public static function remove($table, &$i) {
        global $mysqli;

        if (!isset($i->remove) || !is_array($i->remove) || !count($i->remove) > 0) {$i->removeMessage = 'nothing to remove'; return false;}

        if (is_numeric($i->remove)) {$cnd = 'where id = ' . $i->remove;}
        else if (is_array($i->remove))   {$cnd = 'where id in ("' . implode('","', array_map(array($mysqli, 'real_escape_string'), $i->remove)) . '")';}
        else {$cnd = 'where id = "' . $mysqli->real_escape_string($i->remove) . '"';}

        if ($stmt = $mysqli->prepare(
            "delete from `$table` $cnd"
        )) {
            $i->removeSuccess = $stmt->execute();
            $i->removeRows = $mysqli->affected_rows;
            $i->removeSuccess OR $r->removeError = $mysqli->error;
            $stmt->close();
        }
        return true;
    }

    public static function update($table, &$i) {
        global $mysqli;

        $fieldBind  = array();
        $fieldInfo  = array();
        $fieldSet   = array();
        $fieldTypes = '';
        $parameters = array();
        $results    = array();

        if (!isset($i->data, $i->data->id) || $i->data->id == '' || $i->data->id == null) {$i->update = false; return false;}
        $i->update = true;

        $r = initResult($i);

        $stmt = $mysqli->prepare("show columns from `$table`") or die("Problem finding columns in `$table`");
        $stmt->execute();
        $meta = $stmt->result_metadata();
        while ($field = $meta->fetch_field()) {
            $parameters[] = &$row[$field->name];
        }
        call_user_func_array(array($stmt, 'bind_result'), $parameters);

        $fieldBind  = array();
        $fieldSet   = array();
        $fieldTypes = '';
        while ($stmt->fetch()) {
            $fieldInfo = array();
            foreach ($row as $key => $val) {$fieldInfo[$key] = $val;}
            $results[] = $fieldInfo;

            if ($fieldInfo['Key'] != 'PRI' && isset($i->data->{$fieldInfo['Field']})) {

                $fieldSet[] = '`' . $fieldInfo['Field'] . '` = ?';
                $fieldBind[] = '$i->data->' . $fieldInfo['Field'];

                //>>>>>FINISH all types???????
                if ($fieldInfo['Type'] == 'text' || strpos($fieldInfo['Type'], 'char') !== false) {$fieldTypes .= 's';}
                else if (strpos($fieldInfo['Type'], 'int') !== false) {$fieldTypes .= 'i';}
                else {$fieldTypes .= 'd';}
            }
        }
        //>>>>FINISH naughty eval, FUTURE bind correctly
        eval(
            'if ($stmt = $mysqli->prepare("'
            . "update `$table` set " . implode(' , ', $fieldSet) . " where `id` = ?"
            . '")) {
                $stmt->bind_param("' . $fieldTypes . 'i", '
                    . implode(',', $fieldBind)
                    . ',$i->data->id
                );
                $r->successUpdate = $stmt->execute();
                $r->rows = $mysqli->affected_rows;
                $r->successUpdate OR $r->errorUpdate = $mysqli->error;
                $stmt->close();
            }'
        );
        return true;
    }
}

class Db_Get {

    public static function event($i, $extend = false) {
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
            $r->data = \ja\fetch_result($stmt,'id');
            $stmt->close();
        }
        return $r;
    }

    public static function grp($i, $extend = false) {
        global $mysqli;

        $r = $extend ? initResult($i) : new \stdClass;
        $c = $i->criteria;

        $cnd = "";

        if (isset($c->grpIds) && is_array($c->grpIds) && count($c->grpIds) > 0) {
            $grpIds = implode(',', $c->grpIds);
            $cnd = "where id in ($grpIds)";
        }
        if ($stmt = $mysqli->prepare(
            "select *
            from `grp` $cnd"
        )) {
            $r->success = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->data = \ja\fetch_result($stmt,'id');
            $stmt->close();
        }
        return $r;
    }

    public static function info($i, $extend = false) {
        global $mysqli;

        $r = $extend ? initResult($i) : new \stdClass;
        $c = $i->criteria;

        $cnd = "";

        if (isset($c->infoIds) && is_array($c->infoIds) && count($c->infoIds) > 0) {
            $infoIds = implode(',', $c->infoIds);
            $cnd = "where id in ($infoIds)";
        }
        if (isset($c->dbTable, $c->pks) && is_array($c->pks) && count($c->pks) > 0) {
            $pks = implode(',', $c->pks);
            $cnd = "where dbTable = $c->dbTable and pk in ($pks)";
        }
        if (isset($c->dbTable, $c->pk)) {
            $cnd = "where dbTable = $c->dbTable and pk = $c->pk";
        }
        if ($stmt = $mysqli->prepare(
            "select *
            from `info` $cnd
            order by seq, id desc"
        )) {
            $r->success = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->data = \ja\fetch_result($stmt,'id');
            $stmt->close();
        }
        return $r;
    }
}

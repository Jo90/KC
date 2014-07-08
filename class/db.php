<?php //class/db.php

namespace j;

class Db extends Core {

    /**
     *  Generic insert,remove,update
     */
    public static function set($table, &$i) {
        global $mysqli;
        Db::remove($table, $i);
        if (isset($i->records)) {
            foreach ($i->records as $rec) {
                Db::update($table, $rec) or Db::insert($table, $rec);
            }
        }
    }

    /**
     *  insert,remove,update
     */
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
                \$i->insertSuccess = \$stmt->execute();
                \$i->insertRows = \$mysqli->affected_rows;
                \$i->insertSuccess
                    ?\$i->data->id    = \$stmt->insert_id
                    :\$r->insertError = \$mysqli->error;
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

        if (!isset($i->data, $i->data->id)) {$i->update = false; return false;}
        $i->update = true;

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
                $i->updateSuccess = $stmt->execute();
                $i->updateRows = $mysqli->affected_rows;
                $i->updateSuccess OR $i->updateError = $mysqli->error;
                $stmt->close();
            }'
        );
        return true;
    }
}

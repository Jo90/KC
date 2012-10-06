<?php
/**
 * @file Factory.php
 *
 * @description
 * Used to instantiate a DAO.
 * Because DAO class can be extended, these classes are stored in this directory
 * and if exist are called instead.  They will normalled always extend the
 * base DAO_Table class
 *
 * @use
 *
 * @parameters
 * $table (string) table name in $db_link schema
 * $db (object mysqli) or db_MySQL class to identify db
 *
 * @company
 * Wiseberry
 *
 * @history
 * Created: 7 Sep 2009 JFD
 *
 * @warning
 * - case sensitivity between db table names and os file names, this hopefully will be okay as the
 *   the MySQL tables will reflect the operating system.
 *
 *
 */
namespace kc;
class DAO_Factory
{
    public static function table($table, $db) {
        // mandatory parameters
        if (!isset($table, $db)) {
            throw new \Exception('Must specify table and db');
        }
        if (!$db->tableExists($table)) {
            throw new \Exception('table not found');
        }
        // invoke if dao/tableName.php class exists
        if (file_exists($table.'.php')) {
            $class = 'DAO_'.$table;
            return new $class($db);
        } else {
            return new DAO_Table($table, $db);
        }
    }
}
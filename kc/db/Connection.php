<?php
/**
 * @file Connections.php
 *
 * @description
 * A singleton class to hold all database connections.
 *
 * @use
 * 
 * @parameters
 * An associative array defining host, user, password and db name is required.
 * 
 * @company
 * Wiseberry
 *
 * @history
 * Created: 9 Sep 2009 JFD
 *
 * @todo
 * - overwrite existing db connection with same name?????
 *
 *
 */
namespace kc;
class DB_Connection
{
    private static $links;    // database links

    private function __construct() {
        self::$links = new \stdClass();
    }
    /**
     * @function set
     *
     * create or set a new db connection
     *
     */
    public static function set(array $arr) {
        // mandatory parameters
		if (!isset($arr['id'], $arr['type'], $arr['host'], $arr['user'], $arr['password'], $arr['db'])) {
			throw new \Exception('Must pass unique id, host, user, password, db name and type');
		}
        // check existence
        if (!self::$links) {
            self::$links = new self;
        }
        //
        switch (strtolower($arr['type'])) {
            case "mysql":
                self::$links->$arr['id'] = new DB_MySQL($arr);
                break;
            default:
                throw new \Exception('Database type not recognised');
        }
    }
    /**
     *  @function get
     *
     *  create or set a new db connection
     *  @param
     *  $connectionId (string) self::$links db id
     *  @return
     *  DB_Xxxx class database abstraction class
     */
    public static function get($connectionId) {
        if (!self::$links || !isset(self::$links) || !self::$links->$connectionId) {
            throw new \Exception('Database connection id not found');
        }
        return self::$links->$connectionId;
    }
}
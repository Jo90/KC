<?php
/** /kc-config.php
 *
 * general configuration
 *
 * namespace
 * NAMED CONSTANTS
 * __autoload
 * shared functions
 * environment (error logging, DB connections)
 * 
 * >>>>FINISH
 * will need to implement some polling system instead of session.gc_maxlifetime
 *
 */
namespace kc;
if (!isset($_SESSION)) {session_start();}
//php session timeout 30 mins
ini_set('session.gc_maxlifetime',30*60);
/**
 * NAMED CONSTANTS
 */
define('KC_COMPANY'            , 'Kauri Coast Promotion Society');
define('KC_SLOGON'             , 'Leaders in Communication and Collaboration');
define('KC_ADMIN_EMAIL'        , 'joe@dargaville.net');
define('KC_ADMIN_ADMINISTRATOR', 'Joseph Douglas');
define('KC_QUERY_LIMIT_OFFSET' , 0);
define('KC_QUERY_LIMIT_ROWS'   , 30);
define('KC_COOKIE_DEVICE'      , 'kc-device'); //>>>>FUTURE
define('KC_COOKIE_THEME'       , 'kc-theme');  //>>>>FUTURE
if (isset($_COOKIE[KC_COOKIE_DEVICE],$_COOKIE[KC_COOKIE_THEME])) {
    define('KC_ENV_DEVICE', $_COOKIE[KC_COOKIE_DEVICE]);
    define('KC_ENV_THEME' , $_COOKIE[KC_COOKIE_THEME]);
}
define('YUI_LIB'                ,'<link rel="stylesheet" type="text/css" id="yuibasecss" href="http://yui.yahooapis.com/3.4.1/build/cssfonts/fonts-min.css?3.4.1/build/cssreset/reset-min.css&3.4.1/build/cssbase/base-min.css">');
define('KC_CHAP'                ,'CHAP'); //userLogon Challenge Handshake AP
define('KC_MEMBER'              ,'member'); //refer userLogon
define('KC_USERLOGON_REMEMBER'  , 'userLogon-remember');
//application
define('KC_ROLE_GENERAL_PURPOSE', 'usUser');
/**
 * SYSTEM NAMED CONSTANTS
 */
define('ROOT', realpath(dirname(__FILE__) . '/..'));
/**
 *
 * autoload classes
 *
 * method recommended by ZEND
 * define own autoload to avoid conflict with future meshups
 * lowercase directory path (before last _)
 *
 */
function kc_autoload($class) {
    // lowercase path
    $last_ = strrpos($class, "_");
    $class = substr_replace($class, substr(strtolower($class), 0, $last_), 0, $last_);
    // substitute directory separators
    $class = str_replace('\\', DIRECTORY_SEPARATOR, $class);
    $class = str_replace('_' , DIRECTORY_SEPARATOR, $class);
    // include
    include ROOT . DIRECTORY_SEPARATOR . $class . '.php';
}
spl_autoload_register(__NAMESPACE__ . '\kc_autoload');
/**
 *  shared PHP functions
 */
require_once 'functions.php';
/**
 *  production, development and testing environments
 *  - error logging and database connections
 *  - define each db connection (singleton class)
 *  - accessible by i.e. $db = \kc\DB_Connection::get('db2');
 */

if ($_SERVER['SERVER_ADMIN'] == 'joe@dargaville.net') {
    error_reporting(E_ALL);
    ini_set('display_errors','On');
    define('KC_SERVER','kc');
    define('KC_PRODUCTION','NO');
    DB_Connection::set(
        array(
            'id'          => 'db1',
            'host'        => 'localhost',
            'user'        => 'root',
            'password'    => 'joe123',
            'db'          =>  KC_SERVER,
            'name'        => 'New MySQL',
            'type'        => 'MySQL',
            'version'     => '5*',
            'description' => 'Development',
        )
    );
} else { //production
	ini_set('display_errors','Off');
    define('KC_SERVER','kc'); //>>>>>>FINISH get ip
    define('KC_PRODUCTION','YES');
    DB_Connection::set(
        array(
            'id'          => 'db2',
            'host'        => '127.0.0.1:3306',
            'user'        => 'root',
            'password'    => 'joe123',
            'db'          => KC_SERVER,
            'name'        => 'MySQL version ???', //>>>>>FINISH
            'type'        => 'MySQL',
            'version'     => '5*',
            'description' => 'Kauri Coast Promotion Society',
        )
    );
}
/**
 * global registry
 */
require_once ROOT . '/class/Registry.class.php';
/**
 *  allow db connections to be referenced through registry
 */
$registry->db = (object)array(
    'db1' => DB_Connection::get('db1'),
    'default' => DB_Connection::get('db1'),
);
/**
 * environment
 */
$mysqli = $registry->db->db1->link;

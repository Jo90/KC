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
define('YUI_CSS'                ,'<link rel="stylesheet" type="text/css" id="yuibasecss" href="http://yui.yahooapis.com/3.8.0/build/cssfonts/fonts-min.css?3.8.0/build/cssreset/reset-min.css&3.8.0/build/cssbase/base-min.css">');
define('YUI_JS'                 ,'<script type="text/javascript" src="http://yui.yahooapis.com/combo?3.8.0/build/yui/yui-min.js&3.8.0/build/loader/loader-min.js"></script>');
define('KC_SALT'                ,'SALT'); //userLogon Challenge Handshake AP - salt initializer
define('KC_MEMBER'              ,'member'); //refer userLogon
define('KC_USERLOGON_REMEMBER'  , 'userLogon-remember');
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
 *  production, development and testing environments
 *  - error logging and database connections
 *  - define each db connection (singleton class)
 *  - accessible by i.e. $db = \kc\DB_Connection::get('db2');
 */

if ($_SERVER['SERVER_ADMIN'] == 'joe@dargaville.net') {
    error_reporting(E_ALL);
    ini_set('display_errors','On');
    define('KC_FILESERVER','kc');
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
    define('KC_FILESERVER','kc');
    define('KC_SERVER','kc'); //>>>>>>FINISH get ip
    define('KC_PRODUCTION','YES');
    DB_Connection::set(
        array(
            'id'          => 'db2',
            'host'        => 'p50mysql461.secureserver.net',
            'user'        => 'kcih',
            'password'    => 'vo1unTeer#',
            'db'          => KC_SERVER,
            'name'        => 'MySQL version 5.0', //>>>>>FINISH
            'type'        => 'MySQL',
            'version'     => '5.0',
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
/**
 *  shared PHP functions
 */
function exitIfNotConnected() {
    if (!isset($_SESSION[KC_MEMBER])) {exit('{connected:false,error:"not connected"}');}
}
/**
 *
 *  emulate generic fetch
 *
 *  Note:
 *  - Need to determine if this sort of approach is okay with text/blob fields?
 *  - table field names must not conflict with local variables, used __variable__ to try to ensure uniqueness
 */
/**
 *  usual fetch data
 *
 *  @parameters
 *  __stmt__ reference to mysqli resource
 *  __fieldName__ whether to use field as primary key
 *  __keys__ true resolve result to [key=>value,...] or false [value,...]
 */
function fetch_result(&$__stmt__,$__fieldName__=null,$__keys__=true) {
    $__meta__ = $__stmt__->result_metadata();
    $__columns__ = array();
    $__dataStructure__ = $__fieldName__==null ? array() : new \stdClass;
    while ($__field__ = $__meta__->fetch_field()) {
        $var = $__field__->name;
        $__columns__[$var] = &$$var;
    }
    call_user_func_array(array($__stmt__,'bind_result'),$__columns__);
    while ($__stmt__->fetch()) {
        $__c__ = $__keys__ ? (object)array() : array();
        foreach($__columns__ as $k=>$v) {
            $__keys__
                ?$__c__->{$k} = $v
                :$__c__[] = $v;
        }
        $__fieldName__==null
            ?$__dataStructure__[] = $__c__
            :$__dataStructure__->{$$__fieldName__} = $__c__;
    }
    return $__dataStructure__;
}
/**
 *  fetch data purely as numeric arrays and includes meta data to resolve field names
 *
 *  @parameters
 *  __stmt__ reference to mysqli resource
 */
function fetch_info(&$__stmt__) {
    $__meta__ = $__stmt__->result_metadata();
    $__columns__ = array();
    $__dataStructure__ = array();
    while ($__field__ = $__meta__->fetch_field()) {
        $var = $__field__->name;
        $__columns__[$var] = &$$var;
    }
    call_user_func_array(array($__stmt__,'bind_result'),$__columns__);
    while ($__stmt__->fetch()) {
        $c = array();
        foreach($__columns__ as $v) {$c[] = $v;}
        $__dataStructure__[] = $c;
    }
    return (object)array(
        'meta' => $__meta__->fetch_fields()
       ,'data' => $__dataStructure__
    );
}
function firstElement($o) {foreach($o as $v) {return $v;}}
/**
 *  dbTables
 */
if ($stmt = $mysqli->prepare("select id,name from `dbTable`")) {
    $stmt->execute();
    $stmt->bind_result($id,$name);
    while ($stmt->fetch()) {
        $dbTable[$id]   = $name;
        $dbTable[$name] = $id;
    }
    $stmt->close();
}
/**
 * //>>>>>>>FINISH/FUTURE
 *  use minified and consolidateed version from /min
 */
function minimal_version($filename, $otherwise) {
    echo (PHP_OS=='Linux' && KC_PRODUCTION=='YES' && file_exists(ROOT . '/min/' . $filename))
        ?'<script src="/assets/min/' . $filename . '" type="text/javascript"></script>' . PHP_EOL
        :$otherwise;
}
/**
 * //>>>>>>>FINISH/FUTURE
 *  use minified and consolidateed version from /min
 */
function sql_fields($arr, $prefix = '') {
    if (!isset($arr) || !is_array($arr) || count($arr)==0) {return '*';}
    if ($prefix != '' && substr($prefix, -1) != '.') {$prefix .= '.';}
    return $prefix . implode(",$prefix", $arr);
}

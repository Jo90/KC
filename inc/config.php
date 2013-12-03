<?php //inc/config.php
/** 
 * NAMED CONSTANTS
 * __autoload
 * shared functions
 * environment
 */

 namespace j;

if (!isset($_SESSION)) {session_start();}
//php session timeout 30 mins
ini_set('session.gc_maxlifetime',30*60);
/**
 * NAMED CONSTANTS
 */
define('J_COMPANY'            , 'Kauri Coast Promotion Society');
define('J_SLOGON'             , 'Leaders in Communication and Collaboration');
define('J_ADMIN_EMAIL'        , 'joe@dargaville.net');
define('J_ADMIN_ADMINISTRATOR', 'Joseph Douglas');
define('J_QUERY_LIMIT_OFFSET' , 0);
define('J_QUERY_LIMIT_ROWS'   , 30);
define('J_COOKIE_DEVICE'      , 'j-device'); //>>>>FUTURE
define('J_COOKIE_THEME'       , 'j-theme');  //>>>>FUTURE
if (isset($_COOKIE[J_COOKIE_DEVICE],$_COOKIE[J_COOKIE_THEME])) {
    define('J_ENV_DEVICE', $_COOKIE[J_COOKIE_DEVICE]);
    define('J_ENV_THEME' , $_COOKIE[J_COOKIE_THEME]);
}

define('YUI_CSS'                ,'<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/3.14.0/build/cssnormalize/cssnormalize-min.css">');
define('YUI_JS'                 ,'<script type="text/javascript" src="http://yui.yahooapis.com/combo?3.14.0/build/yui/yui-min.js&3.14.0/build/loader/loader-min.js"></script>');
define('J_SALT'                ,'SALT'); //userLogon Challenge Handshake AP - salt initializer
define('J_MEMBER'              ,'member'); //refer userLogon
define('J_USERLOGON_REMEMBER'  , 'userLogon-remember');
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
function j_autoload($class) {
    // lowercase path
    $last_ = strrpos($class, "_");
    $class = substr_replace($class, substr(strtolower($class), 0, $last_), 0, $last_);
    // substitute directory separators
    $class = str_replace('\\', DIRECTORY_SEPARATOR, $class);
    $class = str_replace('_' , DIRECTORY_SEPARATOR, $class);
    //redirect
    $dirs = explode('/' ,$class);
    $dirs[0] = 'class';
exit(ROOT . DIRECTORY_SEPARATOR . implode('/', $dirs) . '.php');
    include ROOT . DIRECTORY_SEPARATOR . implode('/', $dirs) . '.php';
}
spl_autoload_register(__NAMESPACE__ . '\j_autoload');

//production
ini_set('display_errors','Off');
define('J_FILESERVER','kcih');
define('J_SERVER','kcih');
define('J_PRODUCTION','YES');

if ($_SERVER['SERVER_ADMIN'] == 'joe@dargaville.net') {
    $mysqli = new \mysqli('localhost', 'root', 'joe123', 'kcih');
} else {
    $mysqli = new \mysqli('localhost', 'root', 'root', 'kcih');
}

/**
 *  shared PHP functions
 */

function exitIfNotConnected() {
    if (!isset($_SESSION[J_MEMBER])) {exit('{connected:false,error:"not connected"}');}
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
function fetch_result(&$__stmt__, $__fieldName__=null, $__keys__=true) {
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

function firstElement($o) {foreach($o as $v) {return $v;}}

function initResult(&$i) {
    if (!isset($i->log   )) {$i->log = array();}
    if (!isset($i->result)) {$i->result = new \stdClass;}
    return $i->result;
}

function explodeArrayForInsert($data, $fields, $dataTypes) { //array, string, string
    $out = array();
    $fieldsArr = explode(',', $fields);
    $fieldsCnt = count($fieldArr);
    foreach ($data as $row) {
        $fields = array();
        for ($i = 0; $i < $fieldsCnt; $i++) {
            if ($dataTypes[$i] == 'i') {
                $fields[] = $row[$i];
            } else {
                $fields[] = '"' . mysql_real_escape_string($row['']) . '"';
            }
        }
        $out[] = $fields;
    }
    return '(' . implode('),(',$out) . ')';
}

function selectIds($dataSet, $field) {
    $ids = array();
    foreach ($dataSet as $d) {$ids[] = $d->{$field};}
    return $ids;
}

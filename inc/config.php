<?php //inc/config.php

namespace j;

if (!isset($_SESSION)) {session_start();}
//php session timeout 30 mins <<FINISH, not used as yet
ini_set('session.gc_maxlifetime',30*60);

define('J_COMPANY'            , 'Kauri Coast Promotion Society');
define('J_SLOGON'             , 'Leaders in Communication and Collaboration');
define('J_TITLE'              , 'Kauri Coast Community Information Hub - Who, What & When');
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
define('J_SALT' , 'SALT'); //userLogon Challenge Handshake AP - salt initializer
define('J_LOGON', 'logon'); //refer userLogon

define('ROOT', realpath(dirname(__FILE__) . '/..'));

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

function j_autoload($class) {
    // substitute directory separators
    $class = str_replace('\\', DIRECTORY_SEPARATOR, strtolower($class));
    $class = str_replace('_' , DIRECTORY_SEPARATOR, $class);
    //namespace to class directory
    $dirs = explode('/' ,$class);
    $dirs[0] = 'class';
    include ROOT . DIRECTORY_SEPARATOR . implode('/', $dirs) . '.php';
}
spl_autoload_register(__NAMESPACE__ . '\j_autoload');

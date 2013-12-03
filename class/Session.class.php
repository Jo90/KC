<?php
/** @file Session.class.php
 *
 * @description
 * Session information
 * 
 * - If not logged in generate a SALT random id for Challenge Handshake AP
 *   must supply to client to enable verification of password
 * - maintain session status
 *   - member logged in
 *   - SALT seed
 * - singleton
 * 
 * @require
 * - member status, requires db to verify member
 * 
 * @notes
 * * server side
 *   - $_SESSION used to maintain logged in status
 *   - $_SESSION['member']   if defined is the current logged in member
 *   - $_SESSION['SALT']   if defined is the current Challenge Handshake AP seed
 * * client side
 *   - DOM <namespace>.session.member if defined indicates who is logged in
 *   - DOM <namespace>.session.SALT = Challenge Handshake AP seed
 * 
 * @todo
 * - 
 * 
 */
namespace j;
/**
 * NAMED CONSTANTS not used yet, intend to incorporate later
 */
defined('ADMIN_EMAIL')         or define('ADMIN_EMAIL'        , 'joe@dargaville.net');
defined('ADMIN_ADMINISTRATOR') or define('ADMIN_ADMINISTRATOR', 'Joseph Douglas');
defined('COMPANY')             or define('COMPANY'            , 'Kauri Coast Promotion Society');

class Session {
    public $member,            // DAO_Member class
           $SALT;              // Challenge Handshake AP random seed
    private static $instance;  // session instance
    private function __construct() {
        self::$instance = new \stdClass;
        // Challenge Handshake seed
        if (isset($_SESSION['SALT'])) {
            $this->SALT = $_SESSION['SALT'];
        } else {
            $this->SALT = self::getRandomString();
            $_SESSION['SALT'] = $this->SALT;
        }
        // member, populated automatically if $_SESSION['member'] exists
        $this->member = new DAO_Member();
    }
    /**
     * @function start
     *
     * create or get current session
     *
     */
    public static function open() {
        // ensure session is started
        if (!isset($_SESSION)) {
            session_start();
        }
        // check existence
        if (!self::$instance) {
            self::$instance = new self;
        }
        return self::$instance;
    }
    /**
     * @function 
     * verify
     * 
     * @parameter
     * login (string) member login id
     * password (string) encrypted password
     * 
     * @note
     * - SHA1 Security Hash 1 encryption
     *
     * @return boolean
     */
    public function verify($logon, $password) {
        if (!$this->member->populateByLogon($logon)){
            return FALSE;
        }
        return SHA1($this->member->info[0]['password'] . SHA1($this->SALT)) == $password;
    }
    /**
     * get randon string for challenge seed
     */
    public function getRandomString($length = 40) {
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $randomString = '';
        $maxvalue = strlen($chars) - 1;
        for ($i=0; $i<$length; $i++) {
            $randomString .= substr($chars,rand(0,$maxvalue),1);
        }
        return $randomString;
    }
}

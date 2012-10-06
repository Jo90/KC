<?php
/**
 * @file Member.php
 *
 * @description
 * used to instantiate an empty Member container.
 *
 * @use
 * 1. To attach to a session to identify a currently logged in member
 * 2. Handle specific members and FUTURE >>> record permissions and roles
 *
 * @company
 * Wiseberry
 *
 * @history
 * Created: 19 Sep 2009 JFD
 *
 * @todo
 * - 
 *
 *
 */
namespace kc;
class DAO_Member extends DAO_Table {
    /**
     *  
     */
    const   table    = 'member'    // member table in db
           ,db       = 'db1';      // database connection id as set in DB_Connection::$links
    public  $info    = array()     // (assoc array) member info
           ,$related = array();

    public function __construct() {
        parent::__construct(self::table, DB_Connection::get(self::db));
        if (isset($_SESSION['member'])) {
            $this->populateById($_SESSION['member']);
        }
    }
    /**
     *  @function populateById
     *
     *  @param $id (string) pk
     */
    public function populateById($id) {
    	$this->info = $this->addFieldKeys($this->getDataByPk($id));
        $this->related = $this->populateRelated();
    }
    /**
     *  @function populateByLogin
     *
     *  @param $logon (string) logon field value
     */
    public function populateByLogon($logon) {
    	$this->info = $this->addFieldKeys($this->getDataWhere("logon='$logon'"));
        $this->related = $this->populateRelated();
    }
    /**
     *  @function populateByRefId
     *
     *  @param $id (string) pk
     */
    public function populateByRefId($id) {
    	$this->info = $this->addFieldKeys($this->getDataWhere("refId='$id'"));
        $this->related = $this->populateRelated();
    }
    /**
     *  @function populateRelated
     *  >>>>FINISH
     *  get grp,etc
     *  @return boolean
     */
    public function populateRelated() {
        /**
         *  related member information
         *  
         *  configurations as required by most applications.
         *  caution: only intended to retrieve primary information related to member (NOT ALL)
         */
    	if (count($this->info)>0) {
            /**
             *  member info
             */
            $usr = new DAO_Table('usr', DB_Connection::get(self::db));
            $rs = $usr->addFieldKeys($usr->getDataByPk($this->info[0]['usr']));
            $x->usr = $rs[0]; //only 1 record
            //
            return $x;
        } else {
            return null;
        }
    }
    /**
     *  @function clear
     *
     *  @return void
     */
    public function clear() {
    	$this->info = array();
    	$this->related = array();
    }
}

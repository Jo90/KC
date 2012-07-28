<?php
/**
 * @file MySQL.php
 *
 * @description
 * All MySQL calls come to this class for resolution.
 * This translates all database specific function calls into a generic database
 * function call for general use by all other modules.
 * Other databases will have their own class.
 *
 * @use
 * Because each database connect only really needs to be invoked once instead of multiple
 * times by each module.  It is suggested that a global variable may be used to instantiate
 * this class and then referenced by all calls needing access to db type calls.
 *
 * The first section of the class translates mysql specific calls to generic calls.
 * i.e. $obj->query is used rather than mysqli_query.
 * The interface db_iDB lists all calls expected to be made to any database.
 * 
 * The second part attempts to expose some sort of data dictionary for the database accessed.
 * 
 * @parameters
 * An associative array defining host, user, password and db name is required.
 * For privacy purposes, host, user and password are not stored as part of the class
 * and only used to establish the connection.
 * 
 * @company
 * Wiseberry
 *
 * @history
 * Created: 1 Sep 2009 JFD
 *
 * @todo
 * - exception handling
 *   db availability, table existence, just throwing an error is not good enough,
 *   there needs to be something defined to catch the errors.
 * - case sensitivity on schema i.e. tables, how to handle? Naming convention camelCase?
 *   How does Linux (caseSensitive) handle this as oppoed to Windows?
 * - the schema for a tables columns needs to be expanded to include field attributes
 *   which can then be used to type cast the class variables and provide better verification
 *   abilities.
 * - need to add quotations for getTableObjFromPK condition building for the primary
 *   keys where the pks are not numbers.
 *
 */
namespace kc;
class DB_MySql implements DB_iDB
{
    public  $link,      // database connection
            $dbSchema;  // meta DB schema information
    private $db;        // database name

    public function __construct($arr) {
        // mandatory parameters
        if (!isset($arr['host'], $arr['user'], $arr['password'], $arr['db'])) {
            throw new \Exception('Must pass host, user, password and db');
        }
        $this->link = self::connect($arr['host'], $arr['user'], $arr['password'], $arr['db']);
        if (!$this->link) {
            throw new \Exception('Unable to connect to database');
        }
        // include other passed parameters except host, user and password
        foreach ($arr as $key => $value) {
            if (!in_array($key, array('host','user','password'))) {
                $this->$key = $value;
            }
        }
    }
    /**
     *
     * translate standard mysqli methods
     *
     */
    private function connect($host, $user, $password, $db) {
        return new \mysqli($host, $user, $password, $db);
    }
    /**
     * @function
     * errno
     */
    public function errno() {
        return mysqli_errno();
    }
    /**
     * @function
     * error
     */
    public function error() {
        return mysqli_error($this->link);
    }
    /**
     * @function
     * fetch
     */
    public function fetch($sql) {
        $data = array();
        $rs = $this->query($sql);
        while ($row = $this->fetch_row($rs)) {
            $data[] = $row;
        }
        return $data;
    }
    /**
     * @function
     * fetch_array
     */
    public function fetch_array($rs) {
        return mysqli_fetch_array($rs);
    }
    /**
     * @function
     * fetch_assoc
     */
    public function fetch_assoc($rs) {
        return mysqli_fetch_assoc($rs);
    }
    /**
     * @function
     * fetch_row
     */
    public function fetch_row($rs) {
        return mysqli_fetch_row($rs);
    }
    /**
     * @function
     * insert_id
     */
    public function insert_id() {
        return mysqli_insert_id($this->link);
    }
    /**
     * @function
     *
     * @param
     * $query (string) series of sql statements separated by ;
     *
     * @return
     * $arr (numeric array) of numberic array of result set rows corresponding to each query
     * Note: returning result sets caused errors later
     *
     */
    public function multi_query($query, $type='NUMERIC') {
        $arr = array();
        $i = 0; // result set counter
        if ($this->link->multi_query($query)) {
            do {
                if ($rs = $this->link->store_result()) {
                    if ($type='NUMERIC') {
                        while ($row = $this->fetch_row($rs)) {
                            $arr[$i][] = $row;
                        }
                    } else {
                        while ($row = $this->fetch_assoc($rs)) {
                            $arr[$i][] = $row;
                        }
                    }
                }
                $rs->free();
                $i++;
                $moreResults = $this->link->more_results();
            } while ($moreResults && $this->link->next_result());
        }
        return $arr;
    }
    /**
     * @function
     * num_rows
     */
    public function num_rows($rs) {
        return mysqli_num_rows($rs);
    }
    /**
     * @function
     * prepare
     */
    public function prepare(&$stmt, $sql) {
        $stmt = mysqli_stmt_init($this->link);
        return mysqli_stmt_prepare($stmt, $sql);
    }
    /**
     * @function
     * query
     */
    public function query($sql) {
        return mysqli_query($this->link, $sql);
    }
    /**
     *
     *  application and database specific methods
     *
     */
    /**
     *  @function getDBSchema
     *
     *  get meta/dictionary data
     *
     *  for tables fields, return assoc array with field_name => ordinal_position
     *  and existing tables
     *
     *  @note
     *  zero base ordinal_position
     */
    private function getDBSchema() {
        $this->dbSchema = new \stdClass;
        // get column names and table names
        $rs=$this->query(
            'select concat(table_name,"_FIELDS"),ordinal_position,column_name
               from information_schema.columns
              where table_name in ("tables","columns","referential_constraints")
                and table_schema="information_schema"
             UNION
             select "TABLES",table_name,0
               from information_schema.tables
              where table_schema="'.$this->db.'"
           order by 1,3'
        );
        while ($row = $this->fetch_row($rs)) {
            if ($row[0]=='TABLES') {
                $this->dbSchema->TABLES->$row[1] = 1;
            }else{
                $this->dbSchema->$row[0]->$row[2] = (int)$row[1]-1;
            }
        }
    }
    /**
     * @function
     *
     * test if table exists in current db
     *
     */
    public function tableExists($tableName) {
        if (!$this->dbSchema) {
            $this->getDBSchema();
        }
        return isset($this->dbSchema->TABLES->$tableName);
    }
    /**
     *  @function tableSchema
     *
     *  Meta data must be standardised across databases and data dictionaries.
     *  MySQL is used as the standard.  Will need to compromise if other DB's added.
     *
     *  Column Schema schema['columns']
     *  Field                    | Type                | Null | Key | Default | Extra
     *  TABLE_CATALOG            | varchar(512)        | YES  |     | NULL    |
     *  TABLE_SCHEMA             | varchar(64)         | NO   |     |         |
     *  TABLE_NAME               | varchar(64)         | NO   |     |         |
     *  COLUMN_NAME              | varchar(64)         | NO   |     |         |
     *  ORDINAL_POSITION         | bigint(21) unsigned | NO   |     | 0       |
     *  COLUMN_DEFAULT           | longtext            | YES  |     | NULL    |
     *  IS_NULLABLE              | varchar(3)          | NO   |     |         |
     *  DATA_TYPE                | varchar(64)         | NO   |     |         |
     *  CHARACTER_MAXIMUM_LENGTH | bigint(21) unsigned | YES  |     | NULL    |
     *  CHARACTER_OCTET_LENGTH   | bigint(21) unsigned | YES  |     | NULL    |
     *  NUMERIC_PRECISION        | bigint(21) unsigned | YES  |     | NULL    |
     *  NUMERIC_SCALE            | bigint(21) unsigned | YES  |     | NULL    |
     *  CHARACTER_SET_NAME       | varchar(32)         | YES  |     | NULL    |
     *  COLLATION_NAME           | varchar(32)         | YES  |     | NULL    |
     *  COLUMN_TYPE              | longtext            | NO   |     | NULL    |
     *  COLUMN_KEY               | varchar(3)          | NO   |     |         |
     *  EXTRA                    | varchar(27)         | NO   |     |         |
     *  PRIVILEGES               | varchar(80)         | NO   |     |         |
     *  COLUMN_COMMENT           | varchar(255)        | NO   |     |         |
     *
     *  Primary Keys schema['primary']
     *  Field                    | Type         | Null | Key | Default | Extra |
     *  COLUMN_NAME              | varchar(64)  | NO   |     |         |       |
     *
     *  @return (object) of tables column names - object used as makes code clearer.
     *
     *
     *  @TODO
     *  - this needs to be expanded to include foreign keys  <<<<<<<<< IMPORTANT
     *  - $columnNamePosition hard coded, should be looked up  <<<<<<<<<<<< LATER
     *
     */
    public function tableSchema($table) {
        $out = new \stdClass;
        $columnNamePosition = 3;
        if (!$this->dbSchema) {
            $this->getDBSchema();
        }
        $resultSets = $this->multi_query(
            'select *
               from information_schema.columns
              where table_name="'.$table.'"
                and table_schema="'.$this->db.'";
             select column_name
               from information_schema.key_column_usage
              where table_name="'.$table.'"
                and table_schema="'.$this->db.'"
                and constraint_name="PRIMARY"
           order by ordinal_position'
           ,'ASSOC'
        );
        foreach ($resultSets[0] as $column) {
            $out->columns->$column[$columnNamePosition] = $column;
        }
        /**
         *  if primary keys defined
         */
        if (isset($resultSets[1])) {
            foreach ($resultSets[1] as $pk) {
                $out->primary[] = $pk[0];
            }
        }
        return $out;
    }
}
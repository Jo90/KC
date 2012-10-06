<?php
/**
 * @file Table.php
 *
 * @description
 * DAO is always associated with a specific database table.
 *
 * @use
 * Main components
 *
 * #1 - see getData* functions
 *      fetch information from the database.
 *      All DAO classes query "select * from table".
 *      Criteria either based on primary key values or generic where condition.
 *      Returns an enumerated array of arrays that contain data for each row retrieved.
 *
 * #2 - delete database rows based on pks
 *
 * #3 - insert
 *
 *
 * #4 - update
 *
 *
 * @parameters
 * $table (string) table name in $db_link schema
 * $db (object mysqli) or db_MySQL class to identify db
 *
 * @history
 * Created: 1 Sep 2009 JFD
 *
 * @todo
 * -
 *
 *
 */
namespace kc;
class DAO_Table
{
    public $tableSchema, // table meta data
           $db,          // db class
           $table;       // (string) table name

    /**
     * __construct
     * @parameter
     * $table (string) table name
     * $db (DB_Xxxx class) abstract database connection class
     */
    public function __construct($table, $db) {
        // mandatory parameters
        if (!isset($table, $db)) {
            throw new \Exception('Must specify table and db');
        }
        if (!$db->tableExists($table)) {
            throw new \Exception('table not found');
        }
        $this->table  = $table;
        $this->db     = $db;
        $this->tableSchema = $db->tableSchema($table);
    }
    /**
     * @function
     * determinePKs
     *
     * Determine primary key(s) from arguments.
     *
     * @param
     * overloading/polymorhism,
     * requires 1 or more arguments
     *
     * If the first argument is not an array then all arguments are treated as primary key values.
     * If the table has a multi field pk then corresponding groups of values are associated with each pk set.
     * Such that all arguments are either arrays or not arrays otherwise an error is raised.
     *
     * Case
     * #1 argument[0] not an array then all arguments represent one or more primary key value sets
     * #2 argument[0] is an associative array
     *                this can contain only 1 set of primary keys
     *                with keys as the pk field names
     * #3 argument[0] enumerated array
     *                error is raised if contents not an array
     *                this must contain arrays with keys being numeric in ordinal field order or the key is the field name
     *
     * @return
     * enumerated array with associative arrays for each set of primary keys
     */
    private function determinePKs(array $arr) {
        $pkArr = array();
        $pkFld = $this->tableSchema->primary;
        $pkNum = count($pkFld);
        /**
         * just pk values as arguments
         */
        if (!is_array($arr[0])) {
            while (current($arr)) {
                if (is_array(current($arr))) {
                    throw new \Exception('can not mix primary key values and arrays');
                }
                $pkSet = array();
                for ($i=0; $i<$pkNum && current($arr); $i++) {
                    $pkSet[$pkFld[$i]] = current($arr);
                    next($arr);
                }
                // push only if full set
                if (count($pkSet)==$pkNum) {
                    $pkArr[] = $pkSet;
                }
            }
            return $pkArr;
        }
        /**
         * all arguments are arrays
         */
        foreach ($arr as $pkArg) {
            if (!is_array($pkArg)) {
                throw new \Exception('can not mix primary key values and arrays');
            }
            if (array_keys($pkArg) == range(0, count($pkArg) - 1)) {
                // is numeric array of arrays of pk sets
                foreach ($pkArg as $pkGrp) {
                    $pkSet = array();
                    for ($i=0; $i<$pkNum && current($pkGrp); $i++) {
                        $pkSet[$pkFld[$i]] = current($pkGrp);
                        next($pkGrp);
                    }
                    $pkArr[] = $pkSet;
                }
            } else {
                // associative array with implied keys for field names
                $pkArr[] = $pkArg;
            }
        }
        return $pkArr;
    }
    /**
     * @function
     * getDataByPK
     *
     * Get a unique record identified by the primary key(s)
     * An ad-hoc polymorphic function
     *
     * @param
     * pass to function determinePKs to determine primary keys
     *
     * @return
     * associative array with tables field names as keys
     *
     * @todo
     * - type cast data type to field data type
     *
     */
    public function getDataByPK() {
        $data = array();
        // normalise passed pks
        $pks = $this->determinePKs(func_get_args());
        // validations
        if (count($pks) == 0) {
            throw new \Exception('no primary key specified');
        }
        // pk sets
        $pkSets = array();
        foreach ($pks as $pk) {
            $pkSets[] = '(' . implode(',', $pk) . ')';
        }
        $condition = '(' . implode(',', (array)$this->tableSchema->primary) . ')
                 in (' . implode(',', $pkSets) . ')';
        //
        return $this->getDataWhere($condition);
    }
    public function getDataWhere($condition='') {
        $data = array();
        if ($condition != '') $condition = 'where ' . $condition;
        $rs=$this->db->query("select * from $this->table $condition");
        while ($row = $this->db->fetch_row($rs)) {
            $this->numerize($row);
            $data[] = $row;
        }
        return $data;
    }
    /**
     *  @function numerize
     *
     *  remove quotes where fields are numeric
     *
     *  @return array
     */
    public function numerize(&$row) {
        $dataTypePosition = (int)$this->db->dbSchema->COLUMNS_FIELDS->DATA_TYPE;
        $ordinalPosition  = (int)$this->db->dbSchema->COLUMNS_FIELDS->ORDINAL_POSITION;
        foreach ($this->tableSchema->columns as $colDetails) {
            /**
             *  integers
             */
            if (in_array($colDetails[$dataTypePosition], array('int','tinyint'))) {
                $col = $colDetails[$ordinalPosition]-1;
                //(int) null = 0 - wrong
                if ($row[$col] != null) {
                    $row[$col] = (int) $row[$col];
                }
            }
            /**
             *  other numeric fields
             *
             *  >>>>>>>>>>>>>>>>>> DO LATER
             *
             */






        }
    }
    /**
     *  @function addKeys
     *
     *  add fields as keys to numeric arrays
     *
     *  @param $data (array) as returned from getDataByPK and getDataWhere
     *  @return assoc array
     */
    public function addFieldKeys(array $data) {
        $assocArray = array();
        foreach ($data as $row) {
            $rec = array();
            $ordinalPosition = (int)$this->db->dbSchema->COLUMNS_FIELDS->ORDINAL_POSITION;
            foreach ($this->tableSchema->columns as $colName => $colDetails) {
                $rec[$colName] = $row[$colDetails[$ordinalPosition]-1];
            }
            $assocArray[] = $rec;
        }
        return $assocArray;
    }
    /**
     * Insert, Update and Delete
     *
     * @param
     * Common parameters
     * $data (associative array) with keys=field names
     * Other
     * $pk: numeric array of primary key values in ordinal order
     *
     */
    /**
     * @function
     *
     * Insert one record into table
     *
     */
    public function insert(array $data) {

        // multi_query
        echo 'insert into $table (field list)
              values (field values)
        ';


    }
    /**
     * @function
     *
     * Insert one record given primary key values
     *
     */
    public function update(array $data, array $pks) {

        // multi_query
        echo 'update $table
                 set field1 = ,
                     field2 = ,
               where (pks) = (pk_values)
        ';


    }
    /**
     * @function
     *
     * Insert one record given primary key values
     *
     */
    public function delete($pks) {
        $data = array();
        // normalise passed pks
        $pks = $this->determinePKs(func_get_args());
        // validations
        if (count($pks) == 0) {
            throw new \Exception('no primary key specified');
        }
        // pk sets
        $pkSets = array();
        foreach ($pks as $pk) {
            $pkSets[] = '(' . implode(',', $pk) . ')';
        }
        // get record(s)
        $rs=$this->db->query(
            'delete from ' . $this->table . '
              where (' . implode(',', (array)$this->tableSchema->primary) . ')
                 in (' . implode(',', $pkSets) . ')'
        );
    }
}
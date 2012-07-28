<?php //kc/db/iDB.php
namespace kc;
interface DB_iDB
{
    public function error();
    public function fetch($sql);
    public function fetch_array($rs);
    public function fetch_assoc($rs);
    public function fetch_row($rs);
    public function multi_query($query);
    public function num_rows($rs);
    public function query($query);
    public function tableExists($tableName);
    public function tableSchema($tableName);
}
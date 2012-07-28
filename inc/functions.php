<?php
/** /kc/inc/functions.php
 *
 *  General PHP functions
 *  - fetch_result, fetch data into records
 *  - fetch_info, plus meta data
 *  - minimal_version, minified and consolidated file
 *  - exitIfNotConnected
 */
namespace kc;

function exitIfNotConnected() {
    if (!isset($_SESSION['member'])) {
        exit('{connected:false,error:"not connected"}');
    }
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

/**
 *  get dbTables
 *
 */
function get_dbTables($mysqli) {
    if ($stmt = $mysqli->prepare(
        "select id,name
           from `dbTable`"
    )) {
        $stmt->execute();
        $stmt->bind_result($id,$name);
        $temp = array();
        while ($stmt->fetch()) {
            $temp[$id] = $name;
        }
        $stmt->close();
        return $temp;
    }
}

/**
 * //>>>>>>>FINISH/FUTURE
 *  use minified and consolidateed version from /min
 */
function minimal_version($filename,$otherwise) {
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

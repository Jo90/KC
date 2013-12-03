<?php
/** //inc/dataSets.php
 *
 */
namespace j;

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

function dataSets($arr, $echo=false) {
    global $mysqli;
    $rs = new \stdClass;
    /**
     *  grp
     */
    if (in_array('grp',$arr) && $stmt = $mysqli->prepare("select * from `grp` order by name")) {
        $stmt->execute();
        $rs->grp = fetch_info($stmt);
        $stmt->close();
    }

    if ($echo) {
        echo PHP_EOL , '//core info'
            ,PHP_EOL , 'if(!window.J){var J={};}'
            ,PHP_EOL , 'if(!J.data){J.data={};}'
            ,PHP_EOL , 'J.data=' , json_encode($rs) , ';';
    } else return $rs;
}
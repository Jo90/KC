<?php
/** /kc/inc/dataSets.php
 *
 */
namespace kc;

function dataSets($arr, $echo=false) {
    global $mysqli;
    $rs = new \stdClass;
    /**
     *  dbTable
     */
    if (in_array('dbTable',$arr) && $stmt = $mysqli->prepare("select * from `dbTable` order by name")) {
        $stmt->execute();
        $rs->dbTable = fetch_info($stmt);
        $stmt->close();
    }
    /**
     *  grp
     */
    if (in_array('grp',$arr) && $stmt = $mysqli->prepare("select * from `grp` order by name")) {
        $stmt->execute();
        $rs->grp = fetch_info($stmt);
        $stmt->close();
    }
    /**
     *  tags
     */
    if (in_array('tgTag',$arr) && $stmt = $mysqli->prepare("select * from `tgTag` order by name")) {
        $stmt->execute();
        $rs->tgTag = fetch_info($stmt);
        $stmt->close();
    }
    /**
     *  tag collection
     */
    if (in_array('tgCollection',$arr) && $stmt = $mysqli->prepare("select * from `tgCollection` order by name")) {
        $stmt->execute();
        $rs->tgCollection = fetch_info($stmt);
        $stmt->close();
    }
    /**
     *  tag collection tag
     */
    if (in_array('tgCollectionTag',$arr) && $stmt = $mysqli->prepare("select * from `tgCollectionTag`")) {
        $stmt->execute();
        $rs->tgCollectionTag = fetch_info($stmt);
        $stmt->close();
    }
    /**
     *  tag collection table
     */
    if (in_array('tgCollectionTable',$arr) && $stmt = $mysqli->prepare("select * from `tgCollectionTable`")) {
        $stmt->execute();
        $rs->tgCollectionTable = fetch_info($stmt);
        $stmt->close();
    }

    if ($echo) {
        echo PHP_EOL , '//core info'
            ,PHP_EOL , 'if(!window.KC){var KC={};}'
            ,PHP_EOL , 'if(!KC.data){KC.data={};}'
            ,PHP_EOL , 'KC.data=' , json_encode($rs) , ';';
    } else return $rs;
}
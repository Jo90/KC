<?php
/** /kc/inc/dataSets.php
 *
 * requires $mysqli = $registry->db->db2->link;
 */
namespace kc;
require_once 'kc-config.php';

function dataSets($arr,$echo=false) {
    global $mysqli; //set in getDataSets()
    $rs = new \stdClass;
    /**
     *  tmTeam
     */
    if (in_array('tmTeam',$arr) && $stmt = $mysqli->prepare("select * from `tmTeam` order by name")) {
        $stmt->execute();
        $rs->tmTeam = fetch_info($stmt);
        $stmt->close();
    }

    if ($echo) {
        echo PHP_EOL , '//core info'
            ,PHP_EOL , 'if(!window.KC){var KC={};}'
            ,PHP_EOL , 'if(!KC.data){KC.data={};}'
            ,PHP_EOL , 'KC.data=' , json_encode($rs) , ';';
    } else return $rs;
}
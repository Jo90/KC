<?php
/** /inc/getDataSets.php?d[]=dataSet1&[]=dataSet2&...
 *
 */
namespace kc;
require_once 'kc-config.php';
require 'dataSets.php';
$mysqli = $registry->db->db2->link; //used by dataSets()
header('Content-type: application/json');
echo json_encode(dataSets($_REQUEST['d']));

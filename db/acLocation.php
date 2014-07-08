<?php
/** //db/acLocation.php
 *
 *  used by
 *  - /pod/usr.js
 */
namespace j;

$post = json_decode(file_get_contents('php://input'));
if (!isset($_REQUEST['location'])) {exit;}

$location = $_REQUEST['location'] . '%';
$data     = new \stdClass;

if ($stmt = $mysqli->prepare(
    'select l.id, l.name, l.category,
            p.name     as parentName,
            p.category as parentCategory
       from `location` as l
      inner join `location` as p
              on l.parent = p.id
      where l.name like ?
   order by l.name
      limit 10'
)) {
    $stmt->bind_param('s', $location);
    $stmt->execute();
    $data = Db_Core::fetch_result($stmt, null, false);
    $stmt->close();
}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($data);
<?php
/** /db/act/common.php
 *
 *  Kauri Coast Promotion Society
 *
 */
namespace kc;

function act_getAct($criteria) {
    global $mysqli;
    $r = new \stdClass;
    $r->criteria = $criteria;
    $cnd = '';
    if (isset($criteria->actIds) && is_array($criteria->actIds) && count($criteria->actIds) > 0) {
        $cnd = "where id in (" . implode(',', $criteria->actIds) . ")";
    }
    if (!isset($criteria->orderBy)) {$criteria->orderBy = 'order by 1 desc';}
    $cnd .= $mysqli->real_escape_string($criteria->orderBy);
    if ($stmt = $mysqli->prepare(
        "select *
           from `act` $cnd
          limit ?,? "
    )) {
        $stmt->bind_param('ii'
           ,$criteria->limitOffset
           ,$criteria->limitRowCount
        );
        $r->success = $stmt->execute();
        $r->rows = $mysqli->affected_rows;
        $r->data = \kc\fetch_result($stmt,'id');
        $stmt->close();
    }
    return $r;
}

function act_getActInfo($criteria) {
    global $mysqli;
    if (!isset($criteria->actIds)) {return null;}
    $r = new \stdClass;
    $r->criteria = $criteria;
    $actIds = implode(',', $criteria->actIds);
    if ($stmt = $mysqli->prepare(
        "select *
           from `actInfo`
          where act in ($actIds)
            order by displayOrder, category"
    )) {
        $r->success = $stmt->execute();
        $r->rows = $mysqli->affected_rows;
        $r->data = \kc\fetch_result($stmt,'id');
        $stmt->close();
    }
    return $r;
}

function act_getActLink($criteria) {
    global $mysqli;
    if (!isset($criteria->actIds)) {return null;}
    $r = new \stdClass;
    $r->criteria = $criteria;
    $actIds = implode(',', $criteria->actIds);
    if ($stmt = $mysqli->prepare(
        "select *
           from `actLink`
          where act in ($actIds)
            order by 1"
    )) {
        $r->success = $stmt->execute();
        $r->rows = $mysqli->affected_rows;
        $r->data = \kc\fetch_result($stmt,'id');
        $stmt->close();
    }
    return $r;
}

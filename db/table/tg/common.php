<?php
/** /db/tag/common.php
 *
 *  Kauri Coast Promotion Society
 *
 */
namespace kc;

function tg_getCollectionTable($criteria) {
    global $mysqli;
    $r = new \stdClass;
    $r->criteria = $criteria;
    if ($stmt = $mysqli->prepare(
        "select id
           from `tgCollectionTable`
           where collection = ?
             and dbTable = ?"
    )) {
        $stmt->bind_param('ii'
           ,$criteria->data->collection
           ,$criteria->data->dbTable
        );
        $r->success = $stmt->execute();
        $r->rows = $mysqli->affected_rows;
        $r->data = \kc\fetch_result($stmt);
        $stmt->close();
    }
    return $r;
}

function tg_getLink($criteria) {
    global $mysqli;
    $r = new \stdClass;
    $r->criteria = $criteria;
    $dbTable = $criteria->dbTable;
    $pks     = implode(',', $criteria->pks);
    if ($stmt = $mysqli->prepare(
        "select tl.*,
                tct.dbTable    as dbTable,
                tct.collection as collection
           from `tgLink`            as tl,
                `tgCollectionTable` as tct
           where tct.dbTable = $dbTable
             and tl.collectionTable = tct.id
             and tl.pk in ($pks)"
    )) {
        $r->success = $stmt->execute();
        $r->rows = $mysqli->affected_rows;
        $r->data = \kc\fetch_result($stmt,'id');
        $stmt->close();
    }
    return $r;
}

function tg_setLink(&$criteria) {
    global $mysqli;
    $criteria->result = new \stdClass;
    $r = $criteria->result;
    if (!isset($criteria, $criteria->data, $criteria->data->tagIds, $criteria->data->pk)) {return null;}
    //parametric polymorphism - if required get collectionTable
    if (!isset($criteria->data->collectionTable) && isset($criteria->data->collection, $criteria->data->dbTable)) {
        $collectionTable = tg_getCollectionTable($criteria);
        $criteria->data->collectionTable = $collectionTable->data[0]->id;
    }
    $cnd = '';
    if (count($criteria->data->tagIds)>0) {
        $tagIds = implode(',', $criteria->data->tagIds);
        $cnd = "and tag not in ($tagIds)";
    }
    if (isset($criteria->data->collectionTable)) {
        if ($stmt = $mysqli->prepare(
            "delete from `tgLink`
              where pk = ?
                and collectionTable = ? $cnd"
        )) {
            $stmt->bind_param('ii'
                ,$criteria->data->pk
                ,$criteria->data->collectionTable
            );
            $r->successDelete = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->successDelete OR $r->errorDelete = $mysqli->error;
            $stmt->close();
        }
    }
    //insert
    if (count($criteria->data->tagIds)>0) {
        if ($stmt = $mysqli->prepare(
            "insert into `tgLink`
                    (collectionTable,tag,pk)
             select ?,id,?
               from `tgTag`
              where id in ($tagIds)
                and id not in (select tag
                                 from `tgLink`
                                where collectionTable = ?
                                  and pk in ($tagIds))"
        )) {
            $stmt->bind_param('iii'
                ,$criteria->data->collectionTable
                ,$criteria->data->pk
                ,$criteria->data->collectionTable
            );
            $r->successInsert = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->successInsert OR $r->errorInsert = $mysqli->error;
            $stmt->close();
        }
    }
}

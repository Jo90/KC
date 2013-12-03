
function grp_setGrp(&$criteria) {
    global $mysqli;




    $caller = array_shift(debug_backtrace());
    exit($caller);





    $tab = 'grp';
    $criteria->result = new \stdClass;
    $r = $criteria->result;
    if (isset($criteria->remove) && $criteria->remove) {
        if ($stmt = $mysqli->prepare(
            "delete from `$tab`
              where id = ?"
        )) {
            $stmt->bind_param('i'
                ,$criteria->data->id
            );
            $r->successDelete = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->successDelete OR $r->errorDelete = $mysqli->error;
            $stmt->close();
        }
        return $r;
    }
    if (isset($criteria->data->id)) {
        if ($stmt = $mysqli->prepare(
            "update `$tab`
                set name = ?,
                    contactDetail = ?
            where id = ?"
        )) {
            $stmt->bind_param('ssi'
                ,$criteria->data->name
                ,$criteria->data->contactDetail
                ,$criteria->data->id
            );
            $r->successUpdate = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->successUpdate OR $r->errorUpdate = $mysqli->error;
            $stmt->close();
        }
        return $r;
    }
    if ($stmt = $mysqli->prepare(
        "insert into `$tab`
                (name,contactDetail)
        values (?,?)"
    )) {
        $stmt->bind_param('ss'
            ,$criteria->data->name
            ,$criteria->data->contactDetail
        );
        $r->successInsert = $stmt->execute();
        $r->rows = $mysqli->affected_rows;
        $r->successInsert
            ?$criteria->data->id = $stmt->insert_id
            :$r->errorInsert = $mysqli->error;
        $stmt->close();
    }
    return $r;
}

function grp_setGrpUsr(&$criteria) {
    global $mysqli;
    $criteria->result = new \stdClass;
    $r = $criteria->result;
    if (isset($criteria->remove) && $criteria->remove) {
        if ($stmt = $mysqli->prepare(
            "delete from `grpUsr`
              where `id` = ?"
        )) {
            $stmt->bind_param('i'
                ,$criteria->data->id
            );
            $r->successDelete = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->successDelete OR $r->errorDelete = $mysqli->error;
            $stmt->close();
        }
        return $r;
    }
    if (isset($criteria->data->id)) {
        if ($stmt = $mysqli->prepare(
            "update `grpUsr`
                set `grp`         = ?,
                    `usr`         = ?,
                    `member`      = ?,
                    `admin`       = ?,
                    `joinRequest` = ?,
                    `joinReason`  = ?
              where `id`          = ?"
        )) {
            $stmt->bind_param('iiiiisi'
                ,$criteria->data->grp
                ,$criteria->data->usr
                ,$criteria->data->member
                ,$criteria->data->admin
                ,$criteria->data->joinRequest
                ,$criteria->data->joinReason
                ,$criteria->data->id
            );
            $r->successUpdate = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->successUpdate OR $r->errorUpdate = $mysqli->error;
            $stmt->close();
        }
        return $r;
    }
    //join request
        if (isset($criteria->data->grp, $criteria->data->usr, $criteria->data->joinReason)
            && !isset($criteria->data->member, $criteria->data->admin, $criteria->data->joinRequest)) {
            if ($stmt = $mysqli->prepare(
                "insert into `grpUsr`
                        (grp,usr,joinReason)
                 values (?,?,?)"
            )) {
                $stmt->bind_param('iis'
                    ,$criteria->data->grp
                    ,$criteria->data->usr
                    ,$criteria->data->joinReason
                );
                $r->successInsertRequest = $stmt->execute();
                $r->rows = $mysqli->affected_rows;
                $r->successInsertRequest
                    ?$criteria->data->id = $stmt->insert_id
                    :$r->errorInsertRequest = $mysqli->error;
                $stmt->close();
            }

        }
    //administrator
        if (isset($criteria->data->grp, $criteria->data->usr, $criteria->data->member)) {
            //>>>>FINISH specific member and admin cases
            if ($stmt = $mysqli->prepare(
                "insert into `grpUsr`
                        (grp,usr,member,admin,joinRequest,joinReason,approved,approvedBy)
                 values (?,?,?,?,?,?,?,?)"
            )) {
                $stmt->bind_param('iiiiisis'
                    ,$criteria->data->grp
                    ,$criteria->data->usr
                    ,$criteria->data->member
                    ,$criteria->data->admin
                    ,$criteria->data->joinRequest
                    ,$criteria->data->joinReason
                    ,$criteria->data->approved
                    ,$criteria->data->approvedBy
                );
                $r->successInsert = $stmt->execute();
                $r->rows = $mysqli->affected_rows;
                $r->successInsert
                    ?$criteria->data->id = $stmt->insert_id
                    :$r->errorInsert = $mysqli->error;
                $stmt->close();
            }
        }
    return $r;
}




function tg_setLink(&$criteria) {
    global $mysqli;
    $criteria->result = new \stdClass;
    $r = $criteria->result;
//>>>>>>>>>>>>>>>>>>>DO
    if (!isset($criteria, $criteria->data, $criteria->data->tagIds, $criteria->data->pk)) {return null;}
    //parametric polymorphism - if required get collectionTable
    $cnd = '';
    if (count($criteria->data->tagIds)>0) {
        $tagIds = implode(',', $criteria->data->tagIds);
        $cnd = "and tag not in ($tagIds)";
    }
    if (isset($criteria->data->id)) {
        if ($stmt = $mysqli->prepare(
            "delete from link`
              where id = ?"
        )) {
            $stmt->bind_param('i'
                ,$criteria->data->id
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
            "insert into `link`
                    (dbTable,pk,tag)
             values (?,?,?)"
        )) {
            $stmt->bind_param('iis'
                ,$criteria->data->dbTable
                ,$criteria->data->pk
                ,$criteria->data->tag
            );
            $r->successInsert = $stmt->execute();
            $r->rows = $mysqli->affected_rows;
            $r->successInsert OR $r->errorInsert = $mysqli->error;
            $stmt->close();
        }
    }
}

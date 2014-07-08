<?php //db/usr_u.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {

    foreach ($i as $table => $ix) {

        if ($table == 'usr') {

            Db::set($table, $ix);

            if (isset($ix->records)) {
                foreach ($ix->records as $rec) {
                    if (isset($rec->children)) {
                        foreach ($rec->children as $childTable => $ic) {
                            if ($childTable == 'info') {
                                Db::set($childTable, $ic);
                            }
                            if ($childTable == 'address') {
                                Db::set($childTable, $ic);
                            }
                            if ($childTable == 'tag' ) {
                                if (isset($ic->remove) && is_array($ic->remove) && count($ic->remove) > 0) {
                                    if ($stmt = $mysqli->prepare(
                                        'delete from `tag`
                                          where `dbTable` = "usr"
                                            and `pk`      = ' . $rec->data->id . '
                                            and `category` in ("' . implode('","', $ic->remove) . '")'
                                    )) {
                                        $ic->removeSuccess = $stmt->execute();
                                        $ic->removeRows = $mysqli->affected_rows;
                                        $ic->removeSuccess OR $ic->removeError = $mysqli->error;
                                        $stmt->close();
                                    }
                                }
                                if (isset($ic->records) && is_array($ic->records) && count($ic->records) > 0) {
                                    if ($stmt = $mysqli->prepare(
                                        "insert into `tag` (`dbTable`,`pk`,`seq`,`category`,`tag`) values ('usr',?,?,?,?)"
                                    )) {
                                        foreach ($ic->records as $cr) {
                                            $stmt->bind_param('iiss', $rec->data->id, $cr->data->seq, $cr->data->category, $cr->data->tag);
                                            $cr->insertSuccess = $stmt->execute();
                                            $cr->insertRows = $mysqli->affected_rows;
                                            $cr->insertSuccess OR $cr->insertError = $mysqli->error;
                                        }
                                    }
                                    $stmt->close();
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($post);

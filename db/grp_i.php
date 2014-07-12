<?php //db/grp_i.php

namespace j;

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {
    if (!isset($i->grp, $i->grp->records)) {continue;}

    Db::set('grp', $i->grp);
    foreach ($i->grp->records as $iGrp) {
        if ($iGrp->insert) {
            //set member grp id
            foreach ($iGrp->children->member->records as $iMember) {
                $iMember->data->grp = $iGrp->data->id;
            }
            Db::set('member', $iGrp->children->member);
            foreach ($iGrp->children->member->records as $iMember) {
                if($iMember->insert){
                    //set role member id
                    foreach ($iMember->children->role->records as $iRole) {
                        $iRole->data->member = $iMember->data->id;
                    }
                    Db::set('role', $iMember->children->role);
                }
            }
        }
    }
}
$mysqli->close();
header('Content-type: text/plain');
echo json_encode($post);

<?php
/** /inc/userData.php
 *
 * return users roles and processes
 *
 */
require_once 'kc-config.php';

function userData() {

    global $registry;

    //sentry
        if (!isset($_SESSION[KC_MEMBER])) {return new \stdClass;}

    //declarations
        $data                = new \stdClass;
        $mysqli              = $registry->db->db2->link;
        $userId           = $_SESSION[KC_MEMBER];
        //ids
        $userTeamIds     = array();
        $teamIds     = array();
        $teamRoleIds = array();
        $processIds          = array();
        $roleIds             = array();

    if ($stmt = $mysqli->prepare(
        "select *
           from `usUser`
          where id = $userId"
    )) {
        $stmt->execute();
        $temp = \kc\fetch_result($stmt);
        $data->user = $temp[0];
        $stmt->close();
    }

    if ($stmt = $mysqli->prepare(
        "select *
           from `member`
          where contact = $userId"
    )) {
        $stmt->execute();
        $temp = \kc\fetch_result($stmt);
        $data->member = $temp[0]; //only 1 record
        unset($data->member->password);
        $stmt->close();
    }

    if ($stmt = $mysqli->prepare(
        "select *
           from `userTeamAssociation`
          where user = $userId"
    )) {
        $stmt->execute();
        $data->userTeamAssociation = \kc\fetch_result($stmt);
        $stmt->close();
        foreach($data->userTeamAssociation as $v) {
            $userTeamIds[] = $v->userTeam;
        }
    }
    $userTeamIds = implode(',', $userTeamIds);
    if ($stmt = $mysqli->prepare(
        "select *
           from `userTeam`
          where id in ($userTeamIds)"
    )) {
        $stmt->execute();
        $data->userTeam = \kc\fetch_result($stmt);
        $stmt->close();
    }

    if ($stmt = $mysqli->prepare(
        "select *
           from `userTeamRole`
          where contact = $userId"
    )) {
        $stmt->execute();
        $data->userTeamRole = \kc\fetch_result($stmt);
        $stmt->close();
        foreach($data->userTeamRole as $v) {
            $teamRoleIds[] = $v->teamRole;
        }
    }
    $teamRoleIds = implode(',', $teamRoleIds);

    if ($stmt = $mysqli->prepare(
        "select *
           from `teamRole`
          where id in ($teamRoleIds)"
    )) {
        $stmt->execute();
        $data->teamRole = \kc\fetch_result($stmt,'id');
        $stmt->close();
        foreach($data->teamRole as $v) {
            $teamIds[] = $v->team;
            $roleIds[] = $v->role;
        }
    }
    $teamIds = implode(',', $teamIds);
    $roleIds = implode(',', $roleIds);

    if ($stmt = $mysqli->prepare(
        "select *
           from `team`
          where id in ($teamIds)"
    )) {
        $stmt->execute();
        $data->team = \kc\fetch_result($stmt,'id');
        $stmt->close();
    }

    if ($stmt = $mysqli->prepare(
        "select *
           from `role`
          where id in ($roleIds)"
    )) {
        $stmt->execute();
        $data->role = \kc\fetch_result($stmt,'id');
        $stmt->close();
    }

    if ($stmt = $mysqli->prepare(
        "select *
           from `roleProcess`
          where role in ($roleIds)"
    )) {
        $stmt->execute();
        $data->roleProcess = \kc\fetch_result($stmt);
        $stmt->close();
        foreach($data->roleProcess as $v) {
            $processIds[] = $v->process;
        }
    }

    //get all processes (only for now), save doing recursive hierarchical query
    if ($stmt = $mysqli->prepare(
        "select *
           from `process`"
    )) {
        $stmt->execute();
        $data->process = \kc\fetch_result($stmt,'id');
        $stmt->close();
    }

    return $data;
}

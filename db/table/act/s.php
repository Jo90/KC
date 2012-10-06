<?php
/** /db/table/act/s.php
 *
 *  Kauri Coast Promotion Society
 *
 */
namespace kc;
require_once 'common.php';

$post = json_decode(file_get_contents('php://input'));

foreach ($post as $i) {

    $i->log = array();
    if (!isset($i->criteria)) {$i->log[] = 'invalid parameters'; continue;}
    $i->result = new \stdClass;
    $r         = $i->result;

    $r->act = act_getAct($i->criteria);

    if (!isset($i->criteria->actIds) || (isset($i->criteria->actIds) && is_array($i->criteria->actIds) && count($i->criteria->actIds) == 0)) {
        $i->criteria->actIds = array();
        foreach ($r->act->data as $v) {$i->criteria->actIds[] = $v->id;}
    }
    $r->actInfo = act_getActInfo($i->criteria);
    $r->actLink = act_getActLink($i->criteria);

}
header('Content-type: text/plain');
echo json_encode($post);

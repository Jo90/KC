<?php //class/core.php

namespace j;

class Core {

    /**
    *
    *  emulate generic fetch
    *
    *  Note:
    *  - Need to determine if this sort of approach is okay with text/blob fields?
    *  - table field names must not conflict with local variables, used __variable__ to try to ensure uniqueness
    *
    *  usual fetch data
    *
    *  @parameters
    *  __stmt__ reference to mysqli resource
    *  __fieldName__ whether to use field as primary key
    *  __keys__ true resolve result to [key=>value,...] or false [value,...]
    */
    public static function fetch_result(&$__stmt__, $__fieldName__=null, $__keys__=true) {
        global $mysqli;
        $__meta__ = $__stmt__->result_metadata();
        $__columns__ = array();
        $__dataStructure__ = $__fieldName__==null ? array() : new \stdClass;
        while ($__field__ = $__meta__->fetch_field()) {
            $var = $__field__->name;
            $__columns__[$var] = &$$var;
        }
        call_user_func_array(array($__stmt__,'bind_result'),$__columns__);
        while ($__stmt__->fetch()) {
            $__c__ = $__keys__ ? (object)array() : array();
            foreach($__columns__ as $k=>$v) {
                $__keys__
                    ?$__c__->{$k} = $v
                    :$__c__[] = $v;
            }
            $__fieldName__==null
                ?$__dataStructure__[] = $__c__
                :$__dataStructure__->{$$__fieldName__} = $__c__;
        }
        return $__dataStructure__;
    }

    public static function firstElement($o) {
        foreach($o as $v) {return $v;}
    }

    public static function initResult(&$i) {
        if (!isset($i->log   )) {$i->log = array();}
        if (!isset($i->result)) {$i->result = new \stdClass;}
        return $i->result;
    }

}

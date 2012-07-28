<?php
/** @file Registry.class.php
 *
 * system configuration
 *
 * @description
 * alternative to registering globals
 */
class Registry {
    private $vars = array();
    public function __set($index, $value) {
        $this->vars[$index] = $value;
    }
    public function __get($index) {
        return $this->vars[$index];
    }
}
$registry = new Registry;

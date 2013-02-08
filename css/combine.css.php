<?php /** /css/combine.css.php
 *
 *  Kauri Coast Promotion Society
 *  Combine css files
 */
namespace kc;
require_once 'kc-config.php';
header('Content-type: text/css');

include 'base.css';

//apply device
if (defined('KC_ENV_DEVICE')) {
    include  './device/' . KC_ENV_DEVICE . '/base.css';
}
//apply theme
if (defined('KC_ENV_THEME')) {
    $theme = substr($registry->themes->{KC_ENV_THEME}->css,9);
    $themeFile = './theme/' . $theme . '/' . $theme . '.css';
    include  $themeFile;
}
//include device theme extensions
if (defined('KC_ENV_DEVICE')) {
    if (defined('KC_ENV_THEME')) {
        $file = './device/theme/' . $theme . '/' . $theme . '.css';
        if (file_exists($file)) {
            include $file;
        }
    }
}

//yui3 overrides
include 'kc-yui3.css';

//passed css files, also include specific device extensions
foreach ($_GET as $k => $v) {
    //PHP replaces dots and spaces with underscores (condition: server css suffix must be lowercase)
    $cssFile = str_replace('_css','.css',$k);
    if (file_exists($cssFile)) include $cssFile;
    //device extensions
    if (defined('KC_ENV_DEVICE')) {
        $file = './device/' . KC_ENV_DEVICE . '/' . $cssFile;
        if (file_exists($file)) {
            include $file;
        }
    }
}

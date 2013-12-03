<?php /** /css/combine.css.php
 *
 */
namespace j;
require_once 'config.php';
header('Content-type: text/css');

include 'base.css';

//apply device
if (defined('J_ENV_DEVICE')) {
    include  './device/' . J_ENV_DEVICE . '/base.css';
}
//apply theme
if (defined('J_ENV_THEME')) {
    $theme = substr($registry->themes->{J_ENV_THEME}->css,9);
    $themeFile = './theme/' . $theme . '/' . $theme . '.css';
    include  $themeFile;
}
//include device theme extensions
if (defined('J_ENV_DEVICE')) {
    if (defined('J_ENV_THEME')) {
        $file = './device/theme/' . $theme . '/' . $theme . '.css';
        if (file_exists($file)) {
            include $file;
        }
    }
}

//yui3 overrides
include 'yui3.css';

//passed css files, also include specific device extensions
foreach ($_GET as $k => $v) {
    //PHP replaces dots and spaces with underscores (condition: server css suffix must be lowercase)
    $cssFile = str_replace('_css','.css',$k);
    if (file_exists($cssFile)) include $cssFile;
    //device extensions
    if (defined('J_ENV_DEVICE')) {
        $file = './device/' . J_ENV_DEVICE . '/' . $cssFile;
        if (file_exists($file)) {
            include $file;
        }
    }
}

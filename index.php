<?php
/** /kc/index.php
 *
 *  Kauri Coast Promotion Society - Information Hub
 *
 */
namespace kc;
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Kauri Coast Promotion Society - Information Hub</title>
<meta name="description" content="Kauri Coast Promotion Society - Information Hub" />
<meta name="keywords" content="Kauri Coast Promotion Society - Information Hub" />
<meta name="author" content="Joseph Douglas" />

<?php echo YUI_CSS; ?>
<link rel="stylesheet" type="text/css" href="/css/combine.css.php?kc_css">
<style type="text/css">
html {height:100%}
body {height:100%;margin:0;padding:0;}
body > em {display:block;color:#800;font-size:1.4em;margin:0.4em 1em;}
.kc-clock {color:rgba(255,255,255,1);float:right;margin:0 200px 0;text-shadow:#80715D 1px 1px 1px;}
.kc-themes {float:right;}
#map_canvas {height:800px;}
</style>
<!-- Google API >>>>>>> WE NEED A GOOGLE API KEY <<<<<<< -->
<!-- src="https://www.google.com/jsapi?key=INSERT-YOUR-KEY" -->
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<?php echo YUI_JS; ?>
<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDQPldnwWeQCpumTWlmDc4CVYhMbgdW1ng&sensor=true"></script>
</head>
<body class="kc-main yui3-skin-sam">
    <!-- background styling -->
    <img class="kc-bg-bl" src="/css/img/kauriTree.png" />
    <img class="kc-bg-br" src="/css/img/ManganuiBluff.png" />
    <section>
        <div class="kc-userLogon"></div>
        <span class="kc-themes"></span>
        <span class="kc-clock"></span>
    </section>
    <em>Kauri Coast Community Information Hub - Who, What &amp; When</em>
    <article>
        <div class="kc-tabs"></div>
    </article>
<?php
//use combined/minified version for production (saves loading individual files)
minimal_version('admin.js','<script src="index.js.php" type="text/javascript"></script>');
?>
</body>
</html>

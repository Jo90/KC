<?php
/** //index.php
 *
 */
namespace j;
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Kauri Coast Promotion Society Inc. - Information and Communication Hub</title>
<meta name="description" content="Kauri Coast Promotion Society Inc. - Information Hub" />
<meta name="keywords" content="Kauri Coast Promotion Society Inc. - Information Hub" />
<meta name="author" content="Joe, et al" />

<?php echo YUI_CSS; ?>
<link rel="icon" type="image/jpeg" href="favicon.jpeg">
<link rel="stylesheet" type="text/css" href="css/combine.css.php?j_css">
<style type="text/css">
html {height:100%}
body {height:100%;margin:0;padding:0;}
body > em {display:block;color:#800;font-size:1.4em;margin:0.4em 1em;}
.j-clock {color:rgba(255,255,255,1);float:right;margin:0 200px 0;text-shadow:#80715D 1px 1px 1px;}
.j-themes {float:right;}
#map_canvas {height:800px;}
</style>
<!-- Google API >>>>>>> WE NEED A GOOGLE API KEY <<<<<<< -->
<!-- src="https://www.google.com/jsapi?key=INSERT-YOUR-KEY" -->
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<?php echo YUI_JS; ?>
<?php
//maps disabled for some reason?
//<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDQPldnwWeQCpumTWlmDc4CVYhMbgdW1ng&sensor=true"></script>
?>
</head>
<body class="j-main yui3-skin-sam">
    <!-- background styling -->
    <img class="j-bg-bl" src="/css/img/kauriTree.png" />
    <img class="j-bg-br" src="/css/img/ManganuiBluff.png" />
    <section>
        <div class="j-userLogon"></div>
        <span class="j-themes"></span>
        <span class="j-clock"></span>
    </section>
    <em>Kauri Coast Community Information Hub - Who, What &amp; When</em>
    <article>
        <div class="j-tabs"></div>
    </article>
    <script src="index.js.php" type="text/javascript"></script>
</body>
</html>

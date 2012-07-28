<?php
/** /kc/index.php
 *
 *  Kauri Coast Promotion Society - Information Hub
 *
 */
namespace kc;
require_once 'kc-config.php';
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Kauri Coast Promotion Society - Information Hub</title>
<meta name="description" content="Kauri Coast Promotion Society - Information Hub" />
<meta name="keywords" content="Kauri Coast Promotion Society - Information Hub" />
<meta name="author" content="Joseph Douglas" />

<?php echo YUI_LIB; ?>
<link rel="stylesheet" type="text/css" href="/css/combine.css.php">
<style>
.kc-clock {color:rgba(255,255,255,1);float:right;text-shadow:#80715D 1px 1px 1px;}
.kc-themes {float:right;}
</style>
<!-- Google API >>>>>>> WE NEED A GOOGLE API KEY <<<<<<< -->
<!-- src="https://www.google.com/jsapi?key=INSERT-YOUR-KEY" -->
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/combo?3.4.1/build/yui/yui-min.js&3.4.1/build/loader/loader-min.js"></script>
</head>
<body class="kc-main yui3-skin-sam">
  <header>
    <select class="kc-userTeamRole"></select>
    <nav>
      <div class="kc-roleMenu"></div>
    </nav>
    <div class="kc-userLogon"></div>
  </header>
  <section>
    <img src="/assets/css/img/kc-online.svg"/>
    <span class="kc-themes"></span>
    <span class="kc-clock"></span>
  </section>
  <article>
    <div class="kc-tabView"></div>
  </article>
<?php
//use combined/minified version for production (saves loading individual files)
//minimal_version('admin.js','<script src="index.js.php" type="text/javascript"></script>');
?>
</body>
</html>

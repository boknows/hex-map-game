<?php
require("config.php");
if(empty($_SESSION['user'])) 
{
    header("Location: index.php");
    die("Redirecting to index.php"); 
}
$username = htmlentities($_SESSION['user']['email'], ENT_QUOTES, 'UTF-8');

#$map = array();
#for($i=0;$i<$_POST['rows'];$i++){
#	for($j=0;$j<$_POST['cols'];$j++){
#		$map[$i][$j] = '{"type":"water","units":0,"n":"","s":"","nw":"","ne":"","sw":"","se":"","owner":"","color":"","connect":"","group":""}';
#	}
#}
#$mapProperties = '{"owners":["bo_knows","Marlon"],"colors":["Orange","Purple"],"turn":0,"turnPhase":"fortify","fortifies":6,"rows":' . $_POST['rows'] . ',"cols":' . $_POST['cols'] . '}';
echo JSON_encode("success");

?>

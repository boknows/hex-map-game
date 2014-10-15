<?php
require("config.php");
if(empty($_SESSION['user'])) 
{
    header("Location: index.php");
    die("Redirecting to index.php"); 
}
$username = htmlentities($_SESSION['user']['email'], ENT_QUOTES, 'UTF-8');
$db = new PDO('mysql:host=localhost;dbname=hex;charset=utf8', 'root', '');

if($_POST['param']=="getMapProperties"){
	$stmt = $db->prepare('SELECT * FROM games WHERE gameID = :gameID AND email = :username');
	$stmt->execute(array(':gameID' => $_POST['gameID'], ':username' => $username));
	foreach ($stmt as $row) {
		$data = $row['mapProperties'];
	}
	echo JSON_encode($data);
}
if($_POST['param']=="getAll"){
	$stmt = $db->prepare('SELECT * FROM games WHERE gameID = :gameID AND email = :username');
	$stmt->execute(array(':gameID' => $_POST['gameID'], ':username' => $username));
	foreach ($stmt as $row) {
		$data['mapArray'] = $row['mapArray'];	
		$data['mapProperties'] = $row['mapProperties'];
	}
	echo JSON_encode($data);
}
if($_POST['param']=="updateMapProperties"){
	$stmt = $db->prepare('UPDATE games SET mapProperties = :mapProperties WHERE gameID = :gameID');
	$stmt->execute(array(':gameID' => $_POST['gameID'], ':mapProperties' => $_POST['mapProperties']));
}
if($_POST['param']=="updateMap"){
	$stmt = $db->prepare('UPDATE games SET mapArray = :mapArray WHERE gameID = :gameID');
	$stmt->execute(array(':gameID' => $_POST['gameID'], ':mapArray' => $_POST['mapArray']));
}
if($_POST['param']=="updateAll"){
	$stmt = $db->prepare('UPDATE games SET mapArray = :mapArray, mapProperties = :mapProperties WHERE gameID = :gameID');
	$stmt->execute(array(':gameID' => $_POST['gameID'], ':mapArray' => $_POST['mapArray'], ':mapProperties' => $_POST['mapProperties']));
}

?>
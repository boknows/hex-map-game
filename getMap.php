<?php
require("config.php");
if(empty($_SESSION['user'])) 
{
    header("Location: index.php");
    die("Redirecting to index.php"); 
}
$username = htmlentities($_SESSION['user']['email'], ENT_QUOTES, 'UTF-8');

if($_POST['param']=="getMapProperties"){
	$stmt = $db->prepare('SELECT * FROM games WHERE gameID = :gameID');
	$stmt->execute(array(':gameID' => $_POST['gameID']));
	foreach ($stmt as $row) {
		$data = $row['mapProperties'];
	}
	echo JSON_encode($data);
}
if($_POST['param']=="getAll"){
	$stmt = $db->prepare('SELECT * FROM games WHERE gameID = :gameID');
	$stmt->execute(array(':gameID' => $_POST['gameID']));
	foreach ($stmt as $row) {
		$data['mapArray'] = $row['mapArray'];	
		$data['mapProperties'] = $row['mapProperties'];
		$data['mapLog'] = $row['mapLog'];
		$data['game_name'] = $row['game_name'];
		$data['minPlayers'] = $row['minPlayers'];
	}
	echo JSON_encode($data);
}
if($_POST['param']=="updateMapProperties"){
	$stmt = $db->prepare('UPDATE games SET mapProperties = :mapProperties WHERE gameID = :gameID');
	$stmt->execute(array(':gameID' => $_POST['gameID'], ':mapProperties' => $_POST['data']));
}
if($_POST['param']=="updateMapLog"){
	$stmt = $db->prepare('UPDATE games SET mapLog = :mapLog WHERE gameID = :gameID');
	$stmt->execute(array(':gameID' => $_POST['gameID'], ':mapLog' => $_POST['data']));
}
if($_POST['param']=="updateMap"){
	$stmt = $db->prepare('UPDATE games SET mapArray = :mapArray WHERE gameID = :gameID');
	$stmt->execute(array(':gameID' => $_POST['gameID'], ':mapArray' => $_POST['data']));
}
if($_POST['param']=="updateAll"){
	$stmt = $db->prepare('UPDATE games SET mapArray = :mapArray, mapProperties = :mapProperties, mapLog = :mapLog WHERE gameID = :gameID');
	$stmt->execute(array(':gameID' => $_POST['gameID'], ':mapArray' => $_POST['mapArray'], ':mapProperties' => $_POST['mapProperties'], ':mapLog' => $_POST['mapLog']));
}
if($_POST['param']=="getAllMaps"){
	$stmt = $db->prepare('SELECT * FROM maps');
	$stmt->execute();
	foreach ($stmt as $row) {
		$data['id'][] = $row['id'];
		$data['name'][] = $row['name'];
	}
	echo JSON_encode($data);
}
if($_POST['param']=="saveMap"){
	$stmt = $db->prepare('INSERT INTO maps (mapArray, mapProperties, name, mapUnits) VALUES (:mapArray, :mapProperties, :name, :mapUnits)');
	$stmt->execute(array(':mapArray' => $_POST['mapArray'], ':mapProperties' => $_POST['mapProperties'], ':name' => $_POST['name'], ':mapUnits' => 'null'));
	echo JSON_encode("Success");
}
if($_POST['param']=="getSingleMap"){
	$stmt = $db->prepare('SELECT * FROM maps WHERE id=:id');
	$stmt->execute(array(":id" => $_POST['id']));
	foreach ($stmt as $row) {
		$data['mapArray'] = $row['mapArray'];	
		$data['mapProperties'] = $row['mapProperties'];
	}
	echo JSON_encode($data);
}


?>
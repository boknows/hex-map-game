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
		$data['mapUnits'] = $row['mapUnits'];
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
	$stmt = $db->prepare('UPDATE games SET mapArray = :mapArray, mapUnits = :mapUnits WHERE gameID = :gameID');
	$stmt->execute(array(':gameID' => $_POST['gameID'], ':mapArray' => $_POST['mapArray'], ':mapUnits' => $_POST['mapUnits']));
}
if($_POST['param']=="updateAll"){
	echo $_POST['mapProperties'];
	$stmt = $db->prepare('UPDATE games SET mapArray = :mapArray, mapProperties = :mapProperties, mapLog = :mapLog, mapUnits = :mapUnits WHERE gameID = :gameID');
	$stmt->execute(array(':gameID' => $_POST['gameID'], ':mapArray' => $_POST['mapArray'], ':mapProperties' => $_POST['mapProperties'], ':mapLog' => $_POST['mapLog'], ':mapUnits' => $_POST['mapUnits']));
	echo JSON_encode("Success");
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
	$stmt->execute(array(':mapArray' => $_POST['mapArray'], ':mapProperties' => $_POST['mapProperties'], ':name' => $_POST['name'], ':mapUnits' => $_POST['mapUnits']));
	$maxMapID = $db->query('SELECT max(id) from maps')->fetchColumn(); 
	$img = $_POST['mapImage'];
	$img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img); 
	$filename = "mapImages/".$maxMapID. ".png";
	file_put_contents($filename, $data);
	echo JSON_encode("Success");
}
if($_POST['param']=="getSingleMap"){
	$stmt = $db->prepare('SELECT * FROM maps WHERE id=:id');
	$stmt->execute(array(":id" => $_POST['id']));
	foreach ($stmt as $row) {
		$data['mapArray'] = $row['mapArray'];	
		$data['mapProperties'] = $row['mapProperties'];
		$data['mapUnits'] = $row['mapUnits'];
	}
	echo JSON_encode($data);
}


?>
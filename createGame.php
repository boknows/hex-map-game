<?php
error_reporting(-1);
require("config.php");
if(empty($_SESSION['user'])) 
{
    header("Location: index.php");
    die("Redirecting to index.php"); 
}

$username = htmlentities($_SESSION['user']['email'], ENT_QUOTES, 'UTF-8');
$db = new PDO('mysql:host=localhost;dbname=hex;charset=utf8', 'root', '');
$stmt = $db->prepare('SELECT * FROM maps WHERE id = :id');
$stmt->execute(array(':id' => '4'));
foreach ($stmt as $row) {
	$data['mapArray'] = $row['mapArray'];	
	$data['mapProperties'] = $row['mapProperties'];
}
$now = time();
$stmt = $db->prepare("SELECT MAX(gameID) FROM games");
$stmt->execute();
$maxID = $stmt->fetchColumn();
$maxID++;
$owners = [];
foreach($_POST['players'] as $var){
    if($var != ""){
        $owners[] = $var;
    }
}
$ownersJson = json_encode($owners);
$mapProperties = '{"owners":' . $ownersJson . ',"colors":["'. $_POST['colorpicker'].'"],"turn":0,"turnPhase":"invited","fortifies":6,"rows":8,"cols":14}';
foreach($_POST['players'] as $var){
    if($var != ""){
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $db->prepare('INSERT INTO games (gameID, game_name, created, email, status, mapArray, mapProperties) VALUES(:gameID, :gameName, :created, :email, :status, :mapArray, :mapProperties)');
        $stmt->execute(array(':gameID' => $maxID, ':gameName' => $_POST['gameName'], ':created' => $now, ':email' => $var, ':status' => 'invited', ':mapArray' => $data['mapArray'], ':mapProperties' => $mapProperties));  
        print_r(array(':gameID' => $maxID, ':gameName' => $_POST['gameName'], ':created' => $now, ':email' => $var, ':status' => 'invited', ':mapArray' => $data['mapArray'], ':mapProperties' => $mapProperties));
        if (!$stmt) {
            echo "\nPDO::errorInfo():\n";
            print_r($db->errorInfo());
        }
    }
}


?>
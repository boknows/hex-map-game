<?php
error_reporting(-1);
require("config.php");
if(empty($_SESSION['user'])) 
{
    header("Location: index.php");
    die("Redirecting to index.php"); 
}

$username = htmlentities($_SESSION['user']['email'], ENT_QUOTES, 'UTF-8');
$stmt = $db->prepare('SELECT * FROM maps WHERE id = :id');
$stmt->execute(array(':id' => $_POST['mapID']));
foreach ($stmt as $row) {
	$data['mapArray'] = $row['mapArray'];	
	$data['mapProperties'] = $row['mapProperties'];	
}
$mapProperties = JSON_decode($data['mapProperties']);

$now = time();
$stmt = $db->prepare("SELECT MAX(gameID) FROM games");
$stmt->execute();
$maxID = $stmt->fetchColumn();
$maxID++;
$owners = array();
foreach($_POST['emails'] as $var){
    if($var != ""){
        $mapProperties->owners[] = $var;
    }
}
$ownersJson = json_encode($owners);
$users = array();
foreach($_POST['usernames'] as $var){
    if($var != ""){
        $mapProperties->users[] = $var;
    }
}
$usersJson = json_encode($users);
$mapProperties->fortifies = intval($_POST['fortifies']);
$mapProperties->creator = $_SESSION['user']['email'];
$mapProperties->turnPhase = "invites";
$mapProperties->colors[] = $_POST['colorpicker'];
$mapProperties->fortifiesUsed = 0;

for($i=0;$i<count($owners)-1;$i++){
    $mapProperties->colors[] = "NULL";
}   

$stmt = $db->prepare('INSERT INTO games (gameID, game_name, created, status, minPlayers, maxPlayers, publicPrivate, mapArray, mapProperties, mapLog) VALUES(:gameID, :gameName, :created, :status, :minPlayers, :maxPlayers, :publicPrivate, :mapArray, :mapProperties, "[]")');
$stmt->execute(array(':gameID' => $maxID, ':gameName' => $_POST['gameName'], ':created' => $now, ':status' => 'invites', ':minPlayers' => $_POST['minPlayers'], ':maxPlayers' => $_POST['maxPlayers'], ':publicPrivate' => $_POST['publicPrivate'], ':mapArray' => $data['mapArray'], ':mapProperties' => JSON_encode($mapProperties)));  
if (!$stmt) {
	echo "\nPDO::errorInfo():\n";
	print_r($db->errorInfo());
}

$inQuery = implode(',', array_fill(0, count($_POST['emails']), '?'));
$stmt = $db->prepare(
    'SELECT *
     FROM users
     WHERE email IN(' . $inQuery . ')'
);
foreach ($_POST['emails'] as $k => $email){
    $stmt->bindValue(($k+1), $email);
}
$stmt->execute();
$games = array();
foreach ($stmt as $row) {
	$games['email'][] = $row['email'];	
	$games['gameQueue'][] = $row['gameQueue'];
}

if(count($games['email'])>0){
	for($i=0;$i<count($games['email']);$i++){
		$str = json_decode($games['gameQueue'][$i], true);

		if($games['email'][$i] == $username){
			$str[] = array('gameID' => $maxID, 'status' => "accepted"); 
		}else{
			$str[] = array('gameID' => $maxID, 'status' => "invited"); 
		}
		
		$stmt = $db->prepare('UPDATE users SET gameQueue = :str WHERE email = :email');
		$stmt->execute(array(':str' => JSON_encode($str), ':email' => $games['email'][$i]));  
	}
}
echo JSON_encode("Game Created");


?>
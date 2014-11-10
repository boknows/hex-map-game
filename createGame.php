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
$stmt->execute(array(':id' => '5'));
foreach ($stmt as $row) {
	$data['mapArray'] = $row['mapArray'];	
	$data['mapProperties'] = $row['mapProperties'];
}
$now = time();
$stmt = $db->prepare("SELECT MAX(gameID) FROM games");
$stmt->execute();
$maxID = $stmt->fetchColumn();
$maxID++;
$owners = array();
foreach($_POST['players'] as $var){
    if($var != ""){
        $owners[] = $var;
    }
}
$ownersJson = json_encode($owners);
$mapProperties = '{"owners":' . $ownersJson . ',"colors":["'. $_POST['colorpicker'].'"';
for($i=0;$i<count($owners)-1;$i++){
    $mapProperties .= ',"NULL"';
}   
$mapProperties .= '],"turn":0,"turnPhase":"invites","fortifies":3,"fortifiesUsed":0,"rows":8,"cols":14,"creator":"' . $_SESSION['user']['email'] . '"}';
$stmt = $db->prepare('INSERT INTO games (gameID, game_name, created, status, minPlayers, maxPlayers, publicPrivate, mapArray, mapProperties, log) VALUES(:gameID, :gameName, :created, :status, :minPlayers, :maxPlayers, :publicPrivate, :mapArray, :mapProperties, "[]")');
$stmt->execute(array(':gameID' => $maxID, ':gameName' => $_POST['gameName'], ':created' => $now, ':status' => 'invites', ':minPlayers' => $_POST['minPlayers'], ':maxPlayers' => $_POST['maxPlayers'], ':publicPrivate' => $_POST['publicPrivate'], ':mapArray' => $data['mapArray'], ':mapProperties' => $mapProperties));  
if (!$stmt) {
	echo "\nPDO::errorInfo():\n";
	print_r($db->errorInfo());
}

$inQuery = implode(',', array_fill(0, count($_POST['players']), '?'));
$stmt = $db->prepare(
    'SELECT *
     FROM users
     WHERE email IN(' . $inQuery . ')'
);
foreach ($_POST['players'] as $k => $email){
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
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
##$owners = [];
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
$mapProperties .= '],"turn":0,"turnPhase":"invited","fortifies":6,"rows":8,"cols":14}';
foreach($_POST['players'] as $var){
    if($var != ""){
        if($var == $_SESSION['user']['email']){
            $stmt = $db->prepare('INSERT INTO games (gameID, game_name, created, email, status, minPlayers, maxPlayers, publicPrivate, mapArray, mapProperties) VALUES(:gameID, :gameName, :created, :email, :status, :minPlayers, :maxPlayers, :publicPrivate, :mapArray, :mapProperties)');
            $stmt->execute(array(':gameID' => $maxID, ':gameName' => $_POST['gameName'], ':created' => $now, ':email' => $var, ':status' => 'accepted', ':minPlayers' => $_POST['minPlayers'], ':maxPlayers' => $_POST['maxPlayers'], ':publicPrivate' => $_POST['publicPrivate'], ':mapArray' => $data['mapArray'], ':mapProperties' => $mapProperties));  
            if (!$stmt) {
                echo "\nPDO::errorInfo():\n";
                print_r($db->errorInfo());
            } 
        }else{
            $stmt = $db->prepare('INSERT INTO games (gameID, game_name, created, email, status, minPlayers, maxPlayers, publicPrivate, mapArray, mapProperties) VALUES(:gameID, :gameName, :created, :email, :status, :minPlayers, :maxPlayers, :publicPrivate, :mapArray, :mapProperties)');
            $stmt->execute(array(':gameID' => $maxID, ':gameName' => $_POST['gameName'], ':created' => $now, ':email' => $var, ':status' => 'invited', ':minPlayers' => $_POST['minPlayers'], ':maxPlayers' => $_POST['maxPlayers'], ':publicPrivate' => $_POST['publicPrivate'], ':mapArray' => $data['mapArray'], ':mapProperties' => $mapProperties));  
            if (!$stmt) {
                echo "\nPDO::errorInfo():\n";
                print_r($db->errorInfo());
            } 
        }
        
    }
}
echo JSON_encode("Game Created");


?>
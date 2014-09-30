<?php
require("config.php");
if(empty($_SESSION['user'])) 
{
    header("Location: index.php");
    die("Redirecting to index.php"); 
}

$username = htmlentities($_SESSION['user']['email'], ENT_QUOTES, 'UTF-8');
$db = new PDO('mysql:host=localhost;dbname=hex;charset=utf8', 'root', '');
##Check if all users have accepted (except current user)
$stmt = $db->prepare('SELECT * FROM games WHERE gameID = :gameID AND status !="accepted"');
$stmt->execute(array(':gameID' => $_POST['gameID']));
foreach ($stmt as $row) {	
	$data['game_name'][] = $row['game_name'];
	$data['status'][] = $row['status'];
    $data['mapProperties'][] = $row['mapProperties'];
}
if(count($data['status']) == 1){
    //$stmt = $db->prepare('UPDATE games SET status = "started" WHERE gameID = :gameID');
    //$stmt->execute(array(':gameID' => $_POST['gameID'])); 
    echo JSON_encode("started");
}else{
    $stmt = $db->prepare('SELECT * FROM games WHERE email = :username AND gameID = :gameID' );
    $stmt->execute(array(':username' => $username, ':gameID' => $_POST['gameID']));
    foreach ($stmt as $row) {	
        $data['game_name'] = $row['game_name'];
        $data['status']= $row['status'];
        $data['mapProperties']= $row['mapProperties'];
    }
    $stmt = $db->prepare('UPDATE games SET status = "accepted" WHERE email = :username AND gameID = :gameID' );
    $stmt->execute(array(':username' => $username, ':gameID' => $_POST['gameID']));
    echo JSON_encode($data);
}



?>
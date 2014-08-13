<?php
require("config.php");
if(empty($_SESSION['user'])) 
{
    header("Location: index.php");
    die("Redirecting to index.php"); 
}

$username = htmlentities($_SESSION['user']['email'], ENT_QUOTES, 'UTF-8');
$db = new PDO('mysql:host=localhost;dbname=hex;charset=utf8', 'root', '');
$stmt = $db->prepare('SELECT * FROM games WHERE email = :username AND gameID = :gameID' );
$stmt->execute(array(':username' => $username, ':gameID' => $_POST['gameID']));
foreach ($stmt as $row) {	
	$data['game_name'] = $row['game_name'];
	$data['status']= $row['status'];
    $data['mapProperties']= $row['mapProperties'];
}

echo JSON_encode($data);

?>
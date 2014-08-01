<?php
require("config.php");
if(empty($_SESSION['user'])) 
{
    header("Location: index.php");
    die("Redirecting to index.php"); 
}
$username = htmlentities($_SESSION['user']['username'], ENT_QUOTES, 'UTF-8');
$db = new PDO('mysql:host=localhost;dbname=hex;charset=utf8', 'root', '');
$stmt = $db->prepare('SELECT * FROM games WHERE player = :username');
$stmt->execute(array(':username' => $username));
foreach ($stmt as $row) {
	$data['gameID'] = $row['gameID'];	
	$data['mapID'] = $row['mapID'];
    $data['name'] = $row['name'];
    $data['created'] = $row['created'];
    $data['ended'] = $row['ended'];
}

echo JSON_encode($data);

?>
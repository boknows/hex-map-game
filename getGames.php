<?php
require("config.php");
if(empty($_SESSION['user'])) 
{
    header("Location: index.php");
    die("Redirecting to index.php"); 
}

$username = htmlentities($_SESSION['user']['email'], ENT_QUOTES, 'UTF-8');
$db = new PDO('mysql:host=localhost;dbname=hex;charset=utf8', 'root', '');
$stmt = $db->prepare('SELECT * FROM games WHERE email = :username');
$stmt->execute(array(':username' => $username));
foreach ($stmt as $row) {
	$data['gameID'][] = $row['gameID'];	
	$data['mapID'][] = $row['mapID'];
    $data['email'][] = $row['email'];
	$data['game_name'][] = $row['game_name'];
    $data['created'][] = $row['created'];
    $data['ended'][] = $row['ended'];
}
for ($i=0; $i<count($data['created']); $i++){
	$epoch = $data['created'][$i]; 
	$dt = new DateTime("@$epoch");  // convert UNIX timestamp to PHP DateTime
	$dt->format('Y-m-d H:i:s'); // output = 2012-08-15 00:00:00 
	$data['created'][$i] = $dt;
}

echo JSON_encode($data);

?>
<?php

$db = new PDO('mysql:host=localhost;dbname=hex;charset=utf8', 'root', '');
$stmt = $db->prepare('SELECT * FROM maps WHERE id = :id');
$stmt->execute(array(':id' => "3"));
foreach ($stmt as $row) {
	$data['mapArray'] = $row['mapArray'];	
	$data['mapProperties'] = $row['mapProperties'];
	//$data = $row['mapArray'];	
}

echo JSON_encode($data);

?>
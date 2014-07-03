<?php

$db = new PDO('mysql:host=localhost;dbname=hex;charset=utf8', 'root', '');
$stmt = $db->prepare('SELECT * FROM maps WHERE id = :id');
$stmt->execute(array(':id' => "1"));
foreach ($stmt as $row) {
	$data = $row['mapArray'];	
}

echo $data;

?>
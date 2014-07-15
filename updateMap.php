<?php

$db = new PDO('mysql:host=localhost;dbname=hex;charset=utf8', 'root', '');
$stmt = $db->prepare('UPDATE maps SET mapArray = :map WHERE id = :id');
$stmt->execute(array(':map' => $_POST['data'], ':id' => "3"));

?>
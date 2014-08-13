<?php

$db = new PDO('mysql:host=localhost;dbname=hex;charset=utf8', 'root', '');
$stmt = $db->prepare('UPDATE games SET mapProperties = :mapProperties WHERE gameID = :gameID');
$stmt->execute(array(':mapProperties' => $_POST['mapProperties'], ':gameID' => $_POST['gameID']));

?>
<?php
require("config.php");
//Clear all

$stmt = $db->prepare('delete FROM games');
$stmt->execute();
$stmt = $db->prepare('UPDATE users SET gameQueue="" WHERE 1');
$stmt->execute();

?>


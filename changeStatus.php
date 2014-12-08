<?php
require("config.php");
if(empty($_SESSION['user'])) 
{
    header("Location: index.php");
    die("Redirecting to index.php"); 
}
if($_POST['param'] == "update"){
	$stmt = $db->prepare('UPDATE games SET status = :status WHERE gameID = :gameID');
	$stmt->execute(array(':gameID' => $_POST['gameID'], ':status' => $_POST['status'])); 
	echo JSON_encode("Success");
}


?>
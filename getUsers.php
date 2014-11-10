<?php 
require("config.php");

if($_GET['q']){
	$stmt = $db->prepare('SELECT * FROM users WHERE username LIKE :q');
	$stmt->execute(array(':q' => "%" . $_GET['q'] . "%"));
}else{
	$stmt = $db->prepare('SELECT * FROM users');
	$stmt->execute();
}

foreach ($stmt as $row) {	
	$data[] = array("id" => $row['email'], "text" => $row['username']);
}
echo JSON_encode($data);
?>
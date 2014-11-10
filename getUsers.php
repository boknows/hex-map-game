<?php 
require("config.php");
if(empty($_SESSION['user'])) 
{
    header("Location: index.php");
    die("Redirecting to index.php"); 
}
if($_GET['q']){
	$stmt = $db->prepare('SELECT * FROM users WHERE username LIKE :q AND username != :username');
	$stmt->execute(array(':q' => "%" . $_GET['q'] . "%", ':username' => $_SESSION['user']['username']));
}else{
	$stmt = $db->prepare('SELECT * FROM users WHERE username != :username');
	$stmt->execute(array(':username' => $_SESSION['user']['username']));
}

foreach ($stmt as $row) {	
	$data[] = array("id" => $row['email'], "text" => $row['username']);
}
echo JSON_encode($data);
?>
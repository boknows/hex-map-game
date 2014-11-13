<?php
require("config.php");
if(empty($_SESSION['user'])) 
{
    header("Location: index.php");
    die("Redirecting to index.php"); 
}

$users = $_POST['users'];
$inQuery = implode(',', array_fill(0, count($users), '?'));
$stmt = $db->prepare(
	'SELECT *
	 FROM users
	 WHERE username IN(' . $inQuery . ')'
);
foreach ($users as $k => $id){
	$stmt->bindValue(($k+1), $id);
}
$stmt->execute();
foreach ($stmt as $row) {
	$games['gameQueue'][] = json_decode($row['gameQueue'], true);	
}

echo JSON_encode($games);
?>
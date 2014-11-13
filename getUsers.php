<?php 
require("config.php");
if(empty($_SESSION['user'])) 
{
    header("Location: index.php");
    die("Redirecting to index.php"); 
}

if($_GET['sel']){
	$selQ = explode(",",$_GET['sel']);
	$inQuery = implode(',', array_fill(0, count($selQ), '?'));
	$stmt = $db->prepare(
		'SELECT *
		 FROM users
		 WHERE username NOT IN(' . $inQuery . ') AND 
		 username != ? AND username LIKE ? '
	);
	foreach ($selQ as $k => $id){
		$stmt->bindValue(($k+1), $id);
	}
	$qStr = "%" . $_GET['q'] . "%";
	$stmt->bindValue($k+2, $_SESSION['user']['username']);
	$stmt->bindValue($k+3, $qStr);
	$stmt->execute();
	foreach ($stmt as $row) {	
		$data[] = array("id" => $row['email'], "text" => $row['username']);
	}
}else{
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
}
echo JSON_encode($data);
?>
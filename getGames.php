<?php
require("config.php");
if(empty($_SESSION['user'])) 
{
    header("Location: index.php");
    die("Redirecting to index.php"); 
}
if($_POST['param'] == "active"){
	$username = htmlentities($_SESSION['user']['email'], ENT_QUOTES, 'UTF-8');
	$stmt = $db->prepare('SELECT * FROM users WHERE email = :username');
	$stmt->execute(array(':username' => $username));
	foreach ($stmt as $row) {	
		$data['gameQueue'] = $row['gameQueue'];
	}
	$obj = json_decode($data['gameQueue']);
	echo "Game Queue: <pre>" . print_r($obj) . "</pre>";
	echo "Type:" . gettype($obj);
	#for ($i=0; $i<count($data['created']); $i++){
	#	$epoch = $data['created'][$i]; 
	#	$dt = new DateTime("@$epoch");  // convert UNIX timestamp to PHP DateTime
	#	$dt->format('Y-m-d H:i:s'); // output = 2012-08-15 00:00:00 
	#	$data['created'][$i] = $dt;
	#}

}



?>
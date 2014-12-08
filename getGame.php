<?php
require("config.php");
if(empty($_SESSION['user'])) 
{
    header("Location: index.php");
    die("Redirecting to index.php"); 
}

$username = htmlentities($_SESSION['user']['email'], ENT_QUOTES, 'UTF-8');
##accept invite
$accept = array();
$stmt = $db->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(array(':email' => $username));
foreach ($stmt as $row) {	
	$accept['email'] = $row['email'];
	$accept['gameQueue'] = json_decode($row['gameQueue'], true);
}
$public = true;
for($i=0;$i<count($accept['gameQueue']);$i++){
	if($accept['gameQueue'][$i]['gameID']==$_POST['gameID']){
		$accept['gameQueue'][$i]['status']="accepted";
		$public = false;
	}
}
if($public == true){
	$accept['gameQueue'][] = array('gameID' => $_POST['gameID'], 'status' => 'accepted');
}
$stmt = $db->prepare('UPDATE users SET gameQueue = :gameQueue WHERE email = :email');
$stmt->execute(array(':gameQueue' => json_encode($accept['gameQueue']), ':email' => $username));

##Check if all users have accepted
$stmt = $db->prepare('SELECT * FROM games WHERE gameID = :gameID');
$stmt->execute(array(':gameID' => $_POST['gameID']));
foreach ($stmt as $row) {	
	$data['game_name'] = $row['game_name'];
	$data['status'] = $row['status'];
    $data['mapProperties'] = $row['mapProperties'];
	$data['minPlayers'] = $row['minPlayers'];
	$data['maxPlayers'] = $row['maxPlayers'];
}
$mapProp = json_decode($data['mapProperties']);
$inQuery = implode(',', array_fill(0, count($mapProp->owners), '?'));
$stmt = $db->prepare(
	'SELECT *
	 FROM users
	 WHERE email IN(' . $inQuery . ')'
);
foreach ($mapProp->owners as $k => $id){
	$stmt->bindValue(($k+1), $id);
}
$stmt->execute();
foreach ($stmt as $row) {	
	$players['email'][] = $row['email'];
	$players['gameQueue'][] = $row['gameQueue'];
}
for($i=0;$i<count($players['gameQueue']);$i++){
	$players['gameQueue'][$i] = json_decode($players['gameQueue'][$i], true);
}
//echo "<pre>".print_r($players['gameQueue'])."</pre>";

$ready = true;
for($i=0;$i<count($players['gameQueue']);$i++){
	for($j=0;$j<count($players['gameQueue'][$i]);$j++){
		if($players['gameQueue'][$i][$j]['gameID']==$_POST['gameID'] && $players['gameQueue'][$i][$j]['status']!="accepted"){
			$ready = false;
		}
	}
}
if(count($mapProp->owners) < $data['minPlayers']){
    $ready = false;
}else if(count($mapProp->owners) >= $data['minPlayers']){
	$ready = true;
}

if($ready == true){
	$mapProp->turnPhase = "unitPlacement";
    $stmt = $db->prepare('UPDATE games SET status = "started", mapProperties = :mapProperties WHERE gameID = :gameID');
    $stmt->execute(array(':gameID' => $_POST['gameID'], ':mapProperties' => json_encode($mapProp))); 
    echo JSON_encode("started");
}else{
	echo JSON_encode("accepted");
}



?>
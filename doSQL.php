<?php
    require("config.php");
//Clear all

$stmt = $db->prepare('delete FROM games');
$stmt->execute();
$stmt = $db->prepare('UPDATE users SET gameQueue="" WHERE 1');
$stmt->execute();


/*
$stmt = $db->prepare('UPDATE maps SET mapProperties = :mapProperties WHERE id=10');
$stmt->execute(array(':mapProperties' => '{"owners":[],"colors":[],"turn":0,"turnPhase":"fortify","fortifies":6,"rows":10,"cols":22,"hexSize":30,"mapBonus":[{"group":1,"sum":7,"amount":7},{"group":2,"sum":7,"amount":7},{"group":3,"sum":7,"amount":7},{"group":4,"sum":7,"amount":7},{"group":5,"sum":7,"amount":7},{"group":6,"sum":7,"amount":7},{"group":7,"sum":7,"amount":7},{"group":8,"sum":7,"amount":7}]}'));

$stmt = $db->prepare('SELECT * FROM maps WHERE id="10"');
$stmt->execute();
foreach ($stmt as $row) {
	$data['mapArray'] = $row['mapArray'];	
	$data['mapProperties'] = $row['mapProperties'];	
	$data['id'] = $row['id'];	
	$data['name'] = $row['name'];
}
echo "<pre>" . print_r($data) . "</pre>";*/
?>


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
	$gamesQ = json_decode($data['gameQueue'], true);
    foreach($gamesQ as $game){
         $ids[] = $game['gameID']; 
         $status[] = $game['status'];
    }
    
    $inQuery = implode(',', array_fill(0, count($ids), '?'));
    $stmt = $db->prepare(
        'SELECT *
         FROM games
         WHERE gameID IN(' . $inQuery . ')'
    );
    foreach ($ids as $k => $id){
        $stmt->bindValue(($k+1), $id);
    }
    $stmt->execute();

    foreach ($stmt as $row) {
        $games['gameID'][] = $row['gameID'];	
        $games['game_name'][] = $row['game_name'];
        $games['created'][] = $row['created'];
        $games['game_name'][] = $row['game_name'];
    }

	for ($i=0; $i<count($games['created']); $i++){
		$epoch = $games['created'][$i]; 
		$dt = new DateTime("@$epoch");  // convert UNIX timestamp to PHP DateTime
		$games['created'][$i] = $dt->format('Y-m-d H:i:s'); // output = 2012-08-15 00:00:00 
	}

    echo JSON_encode($games);
}



?>
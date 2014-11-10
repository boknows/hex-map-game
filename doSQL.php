<?php
    require("config.php");
    

$stmt = $db->prepare('UPDATE users SET gameQueue = "" WHERE 1');
$stmt->execute();

?>
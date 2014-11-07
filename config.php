<?php 
   // try { 	$db = new PDO('mysql:host=localhost;dbname=hex;charset=utf8', 'root', ''); }  //xampp connection
	try { 	$db = new PDO('mysql:host=localhost;dbname=boknows_hex;charset=utf8', 'boknows_cfiresim', 'W#4ecfiresim'); }  //hostgator connection
    catch(PDOException $ex){ die("Failed to connect to the database: " . $ex->getMessage());} 
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC); 
    header('Content-Type: text/html; charset=utf-8'); 
    session_start(); 
?>
<?php
require("config.php");
if(empty($_SESSION['user'])) 
{
    header("Location: index.php");
    die("Redirecting to index.php"); 
}

echo JSON_encode("success");

?>

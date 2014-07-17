<?php
$db = new PDO('mysql:host=localhost;dbname=hex;charset=utf8', 'root', '');

?>
<!DOCTYPE html>
<head>
    <title>Hex</title>
	<script src='http://code.jquery.com/jquery-1.10.2.min.js' language='Javascript' type='text/javascript'></script>
</head>
<body>
	<canvas id="HexCanvas" width="1200" height="900"></canvas>
    <script src="js/hexagon.js"></script>

</body>
<?php
    require("config.php");
    if(empty($_SESSION['user'])) 
    {
        header("Location: index.php");
        die("Redirecting to index.php"); 
    }
?>

<!DOCTYPE html>
<head>
    <title>Hex</title>
	<script src='http://code.jquery.com/jquery-1.10.2.min.js' language='Javascript' type='text/javascript'></script>
    
	<style>
	.Game {
		position: relative;
		border: 1px solid orange;
		width: 1200px;
		height: 900px;
	}
	.Game > canvas {
		position: absolute;
		
		width: 100%;
		height: 100%;
	}
	.Game > .controls {
		position: absolute;
		bottom: 800px;
		left: 1000px;
		height: 40px;
	}
	.Game > .controls > button {
		font-size: 18px;
		box-sizing: border-box;
		margin: 4px;
		border: 1px solid #000;
		background: #FFCC00;
	}
	</style>
</head>
<body>
	<div class=Game>
		<canvas id="HexCanvas" width="1200" height="900"></canvas>
		<div class="controls" id="controls" style="display:none">
			<button type="button" id="singleAttack">Single Attack</button>
			<button type="button" id ="continuousAttack">Continuous Attack</button>
		</div>
		<p style="position: absolute; bottom: 850px; left: 1000px;">Welcome <?php echo htmlentities($_SESSION['user']['username'], ENT_QUOTES, 'UTF-8'); ?>!</p>
	</div>
	<script src="js/hexagon.js"></script>
	 
</body>


   


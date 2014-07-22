<?php
    require("config.php");
    if(empty($_SESSION['user'])) 
    {
        header("Location: index.php");
        die("Redirecting to index.php"); 
    }
?>

<!DOCTYPE html>
<html>
<head>
    <title>Hex</title>
	<script src='http://code.jquery.com/jquery-1.10.2.min.js' language='Javascript' type='text/javascript'></script>
	<script type="text/javascript" src="js/bootstrap-select.min.js"></script> 
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
    <link href="css/bootstrap-select.min.css" rel="stylesheet">
	<link href="css/bootstrap.min.css" rel="stylesheet">

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
	.Game > #controls {
		position: absolute;
		bottom: 750px;
		left: 1000px;
		height: 40px;
	}
	.Game > #endTurn {
		position: absolute;
		bottom: 785px;
		left: 1000px;
		height: 40px;
	}
	.Game > #fortify {
		position: absolute;
		bottom: 750px;
		left: 1000px;
		height: 40px;
	}

	</style>
</head>
<body>
	<input type="hidden" name="username" id="username" value="<?php echo $_SESSION['user']['username']; ?>">
	<div class=Game>
		<canvas id="HexCanvas" width="1200" height="900"></canvas>
		<div class="controls" id="endTurn">
			<button type="button" id="endTurnButton" class="btn btn-primary">End Turn</button>
			<button type="button" id="fortifyButton" class="btn btn-primary">Fortify</button>
		</div>
		<div class="controls" id="fortify" style="display:none">
			
			<div class="btn-group" data-resize="auto">
				Transfer: 
				<select id="transfer"></select> Units.
			</div>
			
			<br>
			<button type="button" class="btn btn-success" id="transferButton">Move</button>
			<button type="button" class="btn btn-danger" id="transferMaxButton">Move(max)</button>
		</div>
		<div class="controls" id="controls" style="display:none">
			<button type="button" id="singleAttack" class="btn btn-primary">Single Attack</button>
			<button type="button" id ="continuousAttack" class="btn btn-primary">Continuous Attack</button>
		</div>
		<p style="position: absolute; bottom: 850px; left: 1000px;" id="msg">Welcome <?php echo htmlentities($_SESSION['user']['username'], ENT_QUOTES, 'UTF-8'); ?>!</p>
	</div>
	<script src="js/hexagon.js"></script>
	
</body>
<script>
$('#transfer').on('changed', function (evt, data) {
			console.log(data);
		});
</script>
</html>

   


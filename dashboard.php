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
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/jquery.onoff.min.js"></script>
	<link href="css/bootstrap.min.css" rel="stylesheet">
	<link href="css/onoffswitch.css" rel="stylesheet">
</head>
<body>
<canvas id="welcomeCanvas" width="300" height="60"></canvas>	
<div class="container-fluid">
	<div class="row-fluid">	
		<div class="col-md-4">
			<h3>Your Games</h3>    
			<table class="table table-striped" id="game_table" style="width: 100%;">
			</table>
			<input type="hidden" id="email" value="<?php echo $_SESSION['user']['email']; ?>">
			<input type="hidden" id="username" value="<?php echo $_SESSION['user']['username']; ?>">
		</div>
		<div class="col-md-4">
			<h3>Public Games to Join</h3>
			<table class="table table-striped" id="publicGames" style="width: 100%;"></table>
			<p id="noPub"></p>
		</div>
	</div>
</div>
<div class="container-fluid">
	<div class="row-fluid">
		<div class="col-md-4">
			<a href="startNewGame.php" class="btn btn-success" role="button">Start New Game</a>
		</div>
	</div>
</div>
<div class="onoffdiv">
	<div class="col-md-4">
		<div class="onoffswitch"> <!-- On/off switch for auto-refreshing page -->
		   	<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch">
		    <label class="onoffswitch-label" for="myonoffswitch">
		        <span class="onoffswitch-inner"></span>
		        <span class="onoffswitch-switch"></span>
		    </label>
		</div>
	</div>
</div>


<script type="text/javascript" src="js/dashboard.js"></script>
</body>
</html>
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
	<script src="js/select2.min.js"></script>
    <script src="js/jquery.simplecolorpicker.js"></script>
    <link href="css/bootstrap-select.min.css" rel="stylesheet">
	<link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/jquery.simplecolorpicker.css">
    <link rel="stylesheet" href="css/jquery.simplecolorpicker-glyphicons.css">
    <link href="css/select2-bootstrap.css" rel="stylesheet"/>
	<link href="css/select2.css" rel="stylesheet"/>
	<style>
	.col-md-9.panel
	{
		border: 1px solid #FFFFFF;
		border-radius: 0.5em;
		background-color: #CCCCCC;
		box-shadow: inset 0 0 2px 1px rgba(0, 0, 0, 1), 0 0 2px 2px rgba(255, 255, 255, 0.25);
		padding: 0.5em;
		color: rgba(255, 255, 255, 1);
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 1), 1px 1px 3px rgba(0, 0, 0, 1);
	}
	</style>
</head>
<body>
<div class="container-fluid">
	<div class="row-fluid">
		<input type="hidden" id="username" value="<?php echo $_SESSION['user']['username']; ?>">
		<input type="hidden" id="email" value="<?php echo $_SESSION['user']['email']; ?>">
		<div class="col-md-12">
			<h3>Start New Game</h3>
			Choose your color:
			<div class="form-group">
				<div class="col-sm-12">
				  <select name="colorpicker" id="colorpicker" class="form-control">
					<option value="#FF66FF" selected>Pink</option>
					<option value="#FF6600">Orange</option>
					<option value="#FFFF00">Yellow</option>
					<option value="#33CC33">Green</option>
					<option value="#0000FF">Blue</option>
					<option value="#AA70AA">Purple</option>
				  </select>
				</div>
			</div>
			<div style="clear: both;"></div>
			<div class="input-group col-md-9">
			<span class='input-group-addon'><b>Game Name:</b></span><input type='text' name='name' class='form-control' id='name'>
			</div>
			<div class="input-group col-md-9">
			<span class='input-group-addon'><b>Opponent 1:</b></span><input type="hidden" id="player1" class="form-control select2">
			</div>
			<div class="input-group col-md-9">
			<span class='input-group-addon'><b>Opponent 2:</b></span><input type="hidden" id="player2" class="form-control select2">
			</div>
			<div class="input-group col-md-9">
			<span class='input-group-addon'><b>Opponent 3:</b></span><input type="hidden" id="player3" class="form-control select2">
			</div>
			<div class="input-group col-md-9">
			<span class='input-group-addon'><b>Opponent 4:</b></span><input type="hidden" id="player4" class="form-control select2">
			</div>
			<div class="input-group col-md-9">
			<span class='input-group-addon'><b>Opponent 5:</b></span><input type="hidden" id="player5" class="form-control select2">
			</div>
			<div class="input-group col-md-9">
			<span class='input-group-addon'><b>Opponent 6:</b></span><input type="hidden" id="player6" class="form-control select2">
			</div>
			<div class="input-group col-md-9">
			<span class='input-group-addon'><b>Opponent 7:</b></span><input type="hidden" id="player7" class="form-control select2">
			</div>
			<div class="input-group col-md-9">
			<span class='input-group-addon'><b>Minimum Players:</b></span><select class='form-control' id='minPlayers'><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option></select>
			</div>
			<div class="input-group col-md-9">
			<span class='input-group-addon'><b>Maximum Players:</b></span><select class='form-control' id='maxPlayers' disabled><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option></select>
			</div>
			<div class="input-group col-md-9">
			<span class='input-group-addon'><b>Public/Private Game:</b></span><select class='form-control' id='publicPrivate'><option value='public'>Public</option><option value='private'>Private</option></select>
			</div>
			<h3>Game Options</h3>
			<div class="input-group col-md-9">
			<span class='input-group-addon'><b>Maximum Fortifies:</b></span><input type='text' name='maxFortifies' class='form-control' id='maxFortifies' value="1">
			</div>
			<!--
			<div class="input-group col-md-9">
			<span class='input-group-addon'><b>Map ID:</b></span><select type='text' name='mapID' class='form-control' id='mapID'></select>
			</div> -->
			<div class="input-group col-md-2">
	            <span class='input-group-addon'><b>Map</b></span>
	            <span class="input-group-btn">
	                <button class="btn btn-primary" type="button" id="mapSelectBtn">Select</button>
	            </span>
	        </div>
	        <div class="input-group col-md-10" id="selectedMapDiv">
			
	        </div>
			<div class='input-group'>
			<button class="btn btn-success btn-large" id='createGame' type='button' onclick=createGameVal() data-loading-text="Creating...">Create Game</button><div id='spinner' style="display:none"><img src="css/712.GIF"></div>
			</div>
		</div>
	</div>
	<div class="row-fluid">
		<div id="mapSelectPanel" class="col-md-9 panel" style="position: absolute; left: calc(30% - 20em); right: calc(30% - 20em); top: calc(30% - 11em); background-color: #CCCCCC; display:none; z-index:1000;">
			<div class="row">
				<div id="results" class="col-md-12">
				</div>
				<div id="pages" class="col-md-12">
				</div>
			</div>
		</div>
	</div>
	<div id="thumbnailPopup" style="position: absolute; left: calc(30% - 20em); right: calc(30% - 20em); top: calc(30% - 11em); background-color: #CCCCCC; display:none; z-index:1000;">
		
	</div>
</div>
</body>
<script>
$('select[name="colorpicker"]').simplecolorpicker({theme: 'glyphicons'});
</script>
<script type="text/javascript" src="js/startNewGame.js?v7"></script>
</html>
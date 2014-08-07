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
    .Game > #unitPlacement {
		position: absolute;
		bottom: 785px;
		left: 1000px;
		height: 40px;
	}
	.Game > #unitButtons {
		position: absolute;
		bottom: 785px;
		left: 1000px;
		height: 40px;
	}
    .Game > #editMap {
		position: absolute;
		bottom: 350px;
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
        <div class="controls" id="unitPlacement" style="display:none">
            <p>Select number of units, then click a hexagon.</p> 
            <div class="btn-group" data-resize="auto">
				<select id="place"></select> Units.
			</div>
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
		<div class="controls" id="unitButtons" style="display:none">
			<button type="button" id="undoLast" class="btn btn-danger">Undo Last</button>
			<button type="button" id ="undoAll" class="btn btn-danger">Undo All</button>
            <button type="button" id ="compPlc" class="btn btn-success">Complete Placement</button>
		</div>
        
        <div class="controls" id="editMap">
            <div class="input-group col-md-4">
            <span class='input-group-addon'><b>Type:</b></span><input type='text' name='type' class='form-control' id='type' value=''>
            </div>
            <div class="input-group col-md-4">
            <span class='input-group-addon'><b>Units:</b></span><input type='text' name='units' class='form-control' id='units' value=''>
            </div>
            <div class="input-group col-md-4">
            <span class='input-group-addon'><b>Owner:</b></span><input type='text' name='owner' class='form-control' id='owner' value=''>
            </div>
            <div class="input-group col-md-4">
            <span class='input-group-addon'><b>Color:</b></span><input type='text' name='color' class='form-control' id='color' value=''>
            </div>
            <div class="input-group col-md-4">
            <span class='input-group-addon'><b>N:</b></span><input type='text' name='n' class='form-control' id='n' value=''>
            </div>
            <div class="input-group col-md-4">
            <span class='input-group-addon'><b>NE:</b></span><input type='text' name='ne' class='form-control' id='ne' value=''>
            </div>
            <div class="input-group col-md-4">
            <span class='input-group-addon'><b>SE:</b></span><input type='text' name='se' class='form-control' id='se' value=''>
            </div>
            <div class="input-group col-md-4">
            <span class='input-group-addon'><b>S:</b></span><input type='text' name='s' class='form-control' id='s' value=''>
            </div>
            <div class="input-group col-md-4">
            <span class='input-group-addon'><b>SW:</b></span><input type='text' name='sw' class='form-control' id='sw' value=''>
            </div>
            <div class="input-group col-md-4">
            <span class='input-group-addon'><b>NW:</b></span><input type='text' name='nw' class='form-control' id='nw' value=''>
            </div>
            <button type="button" id ="updateMap" class="btn btn-success">Update Map</button>
        </div> 
        <p style="text-align: right;" id="msg">Welcome <?php echo htmlentities($_SESSION['user']['username'], ENT_QUOTES, 'UTF-8'); ?>!</p>
	</div>
	<input type='hidden' id='game_id' value='<?php echo $_GET['id']; ?>'>
	<script src="js/hexagon-rewrite.js"></script>
	<script src="js/HexagonGrid.js"></script>
	<script src="js/drawHexGrid.js"></script>
	<script src="js/drawHex.js"></script>
	<script src="js/getSelectedTile.js"></script>
	<script src="js/clickEvent.js"></script>
	<script src="js/util.js"></script>
	
</body>
<script>
$('#transfer').on('changed', function (evt, data) {
			console.log(data);
		});
</script>
</html>
   


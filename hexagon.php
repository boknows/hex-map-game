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
    <script src="js/jquery.simplecolorpicker.js"></script>
    <link href="css/bootstrap-select.min.css" rel="stylesheet">
	<link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/jquery.simplecolorpicker.css">
    <link rel="stylesheet" href="css/jquery.simplecolorpicker-glyphicons.css">

	<style>
	canvas {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 160px;
		width: 1200px;
		height: 900px;
	}
	#panel {
		position: absolute;
	}
	#endTurn {
		position: absolute;
	}
	#attack {
		position: absolute;
	}
	#attackMove {
		position: absolute;
	}
	#fortify {
		position: absolute;
		top: 160px;
		width: 325px;
	}
	#unitButtons {
		position: absolute;
		top: 60px;
	}
	
    .Game > #editMap {
		position: absolute;
		bottom: 650px;
        left: 800px;
		height: 40px;
	}
	button {
		margin-top: 3px;
	}

	</style>
</head>
<body>
	<input type="hidden" name="username" id="username" value="<?php echo $_SESSION['user']['username']; ?>">
	<input type="hidden" name="email" id="email" value="<?php echo $_SESSION['user']['email']; ?>">
	<?php
        $stmt = $db->prepare('SELECT * FROM games WHERE gameID = :gameID');
        $stmt->execute(array(':gameID' => $_GET['id']));
        foreach ($stmt as $row) {
	        $data['status'] = $row['status'];
			$data['publicPrivate'] = $row['publicPrivate'];
            $data['mapProperties'] = $row['mapProperties'];
			$data['minPlayers'] = $row['minPlayers'];
			$data['maxPlayers'] = $row['maxPlayers'];
        }
        $mapProp = json_decode($data['mapProperties']);

		//For public invites, check if user is invited AND if game is public
		$publicInv = false;
		for($i=0;$i<count($mapProp->owners);$i++){
			if($mapProp->owners[$i] == $_SESSION['user']['email']){
				$publicInv = true;
			}
		}
		
		
        if($data['status'] == "invites"){
			$stmt = $db->prepare('SELECT * FROM users WHERE email = :email');
			$stmt->execute(array(':email' => $_SESSION['user']['email']));
			foreach ($stmt as $row) {	
				$player['email'] = $row['email'];
				$player['gameQueue'] = json_decode($row['gameQueue'], true);
			}
			$accepted = false;
			for($i=0;$i<count($player['gameQueue']);$i++){
				if($player['gameQueue'][$i]['gameID']==$_GET['id'] && $player['gameQueue'][$i]['status']=="accepted"){
					$accepted = true; 
				}
			}
			echo "<div class='Game' style='display:none;'>";
        }else{
            echo "<div class='Game'>";
        }
		if($data['status'] == "started"){
			$accepted = false;
		}
    ?>
		<canvas id="UICanvas" width="1200" height="900"></canvas>
		<canvas id="HexCanvas" width="1200" height="900"></canvas>
		
		<div id="panel">
		<h2><u>Actions</u></h2>
		<div class="controls" id="endTurn">
			<button type="button" id="fortifyButton" class="btn btn-primary">Fortification Phase</button>
			<button type="button" id="endTurnButton" class="btn btn-primary">End Turn</button>
		</div>
        <div class="controls" id="unitPlacement" style="display:none">
            <p>Select number of units, then click a hexagon.</p> 
            <div class="btn-group" data-resize="auto">
				<select id="place"></select> Units.
			</div>
        </div>
		<div class="controls" id="fortify" style="display:none">
			<div class="input-group col-md-9">
			<span class='input-group-addon'><b>Transfer:</b></span><select class='form-control' id='transfer'></select>
			<span class='input-group-addon'><b>Units</b></span>
			</div>	
			<button type="button" class="btn btn-success" id="transferButton">Transfer</button>
			<br><button type="button" class="btn btn-warning" id="transferMaxButton">Transfer(max)</button>			
		</div>
		<div class="controls" id="attack">
			<button type="button" id="singleAttack" class="btn btn-danger">Single Attack</button>
			<br><button type="button" id ="continuousAttack" class="btn btn-danger">Continuous Attack</button>
		</div>
		<div class="controls" id="attackMove" style="display:none">
			<button type="button" id="attackMoveBtn" class="btn btn-danger">Move</button><select id="attackMoveDrop"></select> Units to defeated hexagon.
			<br><button type="button" id="attackMoveAllBtn" class="btn btn-danger">Move All</button> 
		</div>
        </div>
		<div class="controls" id="unitButtons" style="display:none">
			<button type="button" id="undoLast" class="btn btn-danger">Undo Last</button><br>
			<button type="button" id ="undoAll" class="btn btn-danger">Undo All</button><br>
            <button type="button" id ="compPlc" class="btn btn-success">Complete Placement</button>
		</div>
        <div class="controls" id="editMap" style="display:none">
            <div class="input-group">
            <span class='input-group-addon'><b>Row:</b></span><input type='text' name='row' class='form-control' id='row' value=''>
            </div>
			<div class="input-group">
            <span class='input-group-addon'><b>Column:</b></span><input type='text' name='column' class='form-control' id='column' value=''>
            </div>
			<div class="input-group">
            <span class='input-group-addon'><b>Type:</b></span><input type='text' name='type' class='form-control' id='type' value=''>
            </div>
            <div class="input-group">
            <span class='input-group-addon'><b>Units:</b></span><input type='text' name='units' class='form-control' id='units' value=''>
            </div>
            <div class="input-group">
            <span class='input-group-addon'><b>Owner:</b></span><input type='text' name='owner' class='form-control' id='owner' value=''>
            </div>
            <div class="input-group ">
            <span class='input-group-addon'><b>Color:</b></span><input type='text' name='color' class='form-control' id='color' value=''>
            </div>
            <div class="input-group">
            <span class='input-group-addon'><b>N:</b></span><input type='text' name='n' class='form-control' id='n' value=''>
            </div>
            <div class="input-group">
            <span class='input-group-addon'><b>NE:</b></span><input type='text' name='ne' class='form-control' id='ne' value=''>
            </div>
            <div class="input-group">
            <span class='input-group-addon'><b>SE:</b></span><input type='text' name='se' class='form-control' id='se' value=''>
            </div>
            <div class="input-group">
            <span class='input-group-addon'><b>S:</b></span><input type='text' name='s' class='form-control' id='s' value=''>
            </div>
            <div class="input-group">
            <span class='input-group-addon'><b>SW:</b></span><input type='text' name='sw' class='form-control' id='sw' value=''>
            </div>
            <div class="input-group">
            <span class='input-group-addon'><b>NW:</b></span><input type='text' name='nw' class='form-control' id='nw' value=''>
            </div>
			<div class="input-group">
            <span class='input-group-addon'><b>Connect:</b></span><input type='text' name='connect' class='form-control' id='connect' value=''>
            </div>
			<div class="input-group">
            <span class='input-group-addon'><b>Group:</b></span><input type='text' name='group' class='form-control' id='group' value=''>
            </div>
            <button type="button" id ="updateMap" class="btn btn-success">Update Map</button>
        </div> 
        <div id="msg">Welcome <?php echo htmlentities($_SESSION['user']['username'], ENT_QUOTES, 'UTF-8'); ?>!</div>
	</div>
	<input type='hidden' id='game_id' value='<?php echo $_GET['id']; ?>'>
    <?php
        if($data['status'] == "started"){
            echo "<script src='js/hexagon-rewrite.js'></script>
	        <script src='js/HexagonGrid.js'></script>
            <script src='js/drawHexGrid.js'></script>
            <script src='js/drawHex.js'></script>
            <script src='js/getSelectedTile.js'></script>
            <script src='js/clickEvent.js'></script>
            <script src='js/util.js'></script>";
            echo "<div class='inviteForm' style='display:none;'>";
        }else if($data['status'] == "invites"){
			if($accepted == true){
				echo "<div class='inviteForm' style='display:none;'>";
			}else if ($accepted == false){
				echo "<div class='inviteForm'>";
				echo "<script src='js/util.js'></script>
			<script src='js/acceptInvite.js'></script>";
			}
			
        }     
    ?>
        Choose your color:
        <div class="form-group">
            <div class="col-sm-6">
              <select name="colorpicker" id="colorpicker" class="form-control">
                <option value="#FF66FF" <?php 
                    $trigger = false;
                    for($i=0;$i<count($mapProp->colors);$i++){
                        if($mapProp->colors[$i] == "#FF66FF"){
                            $trigger = true;   
                        }
                    }
                    if($trigger == true){
                        echo "disabled";   
                    } 
                ?>>Pink</option>
                <option value="#FF6600" <?php 
                    $trigger = false;
                    for($i=0;$i<count($mapProp->colors);$i++){
                        if($mapProp->colors[$i] == "#FF6600"){
                            $trigger = true;   
                        }
                    }
                    if($trigger == true){
                        echo "disabled";   
                    } 
                ?>>Orange</option>
                <option value="#FFFF00" <?php 
                    $trigger = false;
                    for($i=0;$i<count($mapProp->colors);$i++){
                        if($mapProp->colors[$i] == "#FFFF00"){
                            $trigger = true;   
                        }
                    }
                    if($trigger == true){
                        echo "disabled";   
                    } 
                ?>>Yellow</option>
                <option value="#33CC33" <?php 
                    $trigger = false;
                    for($i=0;$i<count($mapProp->colors);$i++){
                        if($mapProp->colors[$i] == "#33CC33"){
                            $trigger = true;   
                        }
                    }
                    if($trigger == true){
                        echo "disabled";   
                    } 
                ?>>Green</option>
                <option value="#0000FF" <?php 
                    $trigger = false;
                    for($i=0;$i<count($mapProp->colors);$i++){
                        if($mapProp->colors[$i] == "#0000FF"){
                            $trigger = true;   
                        }
                    }
                    if($trigger == true){
                        echo "disabled";   
                    } 
                ?>>Blue</option>
                <option value="#AA70AA" <?php 
                    $trigger = false;
                    for($i=0;$i<count($mapProp->colors);$i++){
                        if($mapProp->colors[$i] == "#AA70AA"){
                            $trigger = true;   
                        }
                    }
                    if($trigger == true){
                        echo "disabled";   
                    } 
                ?>>Purple</option>
              </select>
            </div>
        </div>
        <div style="clear: both;"></div>
        <div class='input-group'>
		<button class="btn btn-success btn-large" id='acceptInvite' type='button' onclick=acceptInvite() data-loading-text="Loading...">Accept Invite</button>
		</div>
    </div><!-- end inviteForm -->
    <div id="accepted" style="display:<?php
		if($accepted == true){
            echo "inline";   
        }else{
            echo "none";   
        }
    ?>">
    <p>Awaiting other players to accept...</p>
    </div>
    
	
	
</body>
<script>
$('#transfer').on('changed', function (evt, data) {
});
</script>
<script>
$('select[name="colorpicker"]').simplecolorpicker({theme: 'glyphicons'});
</script>
</html>
   


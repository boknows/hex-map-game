<?php
    require("config.php");
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
    canvas {
        
    }
    #panel {
        position: absolute;
        top: 0px;
        right: 100px;
    }

	</style>
</head>
<body>
<canvas id="HexCanvas" width="1200" height="900"></canvas>
<div class="container" id="panel">
    <div class="row">

        <div class="col-md-3">
            <div id="editMapRowsCols">
                <div class="input-group">
                <span class='input-group-addon'><b>Rows:</b></span><input type='text' name='rows' class='form-control' id='rows' value='10'>
                </div>
                <div class="input-group">
                <span class='input-group-addon'><b>Columns:</b></span><input type='text' name='cols' class='form-control' id='cols' value='10'>
                </div>
                <div class="input-group">
                <span class='input-group-addon'><b>Hex Size:</b></span><input type='text' name='size' class='form-control' id='size' value='30'>
                </div>
                <button type="button" id ="updateRowCols" class="btn btn-success">Update Map</button>
            </div>
            <div id="editMap">
                <div class="input-group">
                    <span class='input-group-addon'><b>Type:</b></span><select name='type' class='form-control' id='type'><option value='land'>Land</option><option value='forest'>Forest</option><option value='water'>Water</option><option value='desert'>Desert</option><option value='mountains'>Mountains</option><option value='artic'>Artic</option></select>
                </div>
                <div class="input-group">
                    <span class='input-group-addon'><b>Group:</b></span><input type='text' name='group' class='form-control' id='group' value=''>
                </div>
                <div class="input-group">
                    <span class='input-group-addon'><b>Neutral Owner Start:</b></span><select name='neutral' id='neutral' class='form-control'><option value="false">No</option><option value="true">Yes</option></select>
                </div>
                <div class="input-group">
                    <span class='input-group-addon'><b>Neutral Units Start:</b></span><input type='text' name='nUnits' id='nUnits' class='form-control'>
                </div>
                <div class="input-group">
                    <span class='input-group-addon'><b>Connectors:</b></span>
                    <span class="input-group-btn">
                        <button class="btn btn-default" type="button" id="connectBtn">Select</button>
                        <button class="btn btn-success" type="button" id="connectConfirm" style="display:none">Confirm</button>
                    </span>
                </div>
                <div class="input-group">
                <span class='input-group-addon'><b>Map Name:</b></span><input type='text' name='saveMapName' class='form-control' id='saveMapName' value=''>
                </div>
                <button type="button" id ="saveMap" class="btn btn-success">Save Map</button>
                <br><br>
                <button class="btn btn-primary" type="button" id="options">Show/Hide All Options</button><br><br>
                <div class="input-group">
                    <span class='input-group-addon'><b>Load Map:</b></span><select type='text' name='loadMap' class='form-control' id='loadMap'></select>
                </div>
                <button type="button" id ="loadMapBtn" class="btn btn-success">Load</button>
            </div> 
        </div>
        <div class="col-md-3" id="otherMapOptions" style="display:none">
            <p style="font-size:150%"><b><u>Borders</u></b></p>
            <div class="input-group">
                <span class='input-group-addon'><b>N:</b></span><select name='n' class='form-control' id='n'><option value="None">None</option><option value="#000000">Black</option><option value="#00FF00">Green</option></select>
            </div>
            <div class="input-group">
                <span class='input-group-addon'><b>NE:</b></span><select name='ne' class='form-control' id='ne'><option value="None">None</option><option value="#000000">Black</option><option value="#00FF00">Green</option></select>
            </div>
            <div class="input-group">
                <span class='input-group-addon'><b>SE:</b></span><select name='se' class='form-control' id='se'><option value="None">None</option><option value="#000000">Black</option><option value="#00FF00">Green</option></select>
            </div>
            <div class="input-group">
                <span class='input-group-addon'><b>S:</b></span><select name='s' class='form-control' id='s'><option value="None">None</option><option value="#000000">Black</option><option value="#00FF00">Green</option></select>
            </div>
            <div class="input-group">
                <span class='input-group-addon'><b>SW:</b></span><select name='sw' class='form-control' id='sw'><option value="None">None</option><option value="#000000">Black</option><option value="#00FF00">Green</option></select>
            </div>
            <div class="input-group">
                <span class='input-group-addon'><b>NW:</b></span><select name='nw' class='form-control' id='nw'><option value="None">None</option><option value="#000000">Black</option><option value="#00FF00">Green</option></select>
            </div>
            <div class="input-group">
                <span class='input-group-addon'><b>Group 1 Bonus:</b></span><input type='text' name='group1bonus' class='form-control' id='group1bonus' value='0'>
            </div>
            <div class="input-group">
                <span class='input-group-addon'><b>Group 2 Bonus:</b></span><input type='text' name='group2bonus' class='form-control' id='group2bonus' value='0'>
            </div>
            <div class="input-group">
                <span class='input-group-addon'><b>Group 3 Bonus:</b></span><input type='text' name='group3bonus' class='form-control' id='group3bonus' value='0'>
            </div>
            <div class="input-group">
                <span class='input-group-addon'><b>Group 4 Bonus:</b></span><input type='text' name='group4bonus' class='form-control' id='group4bonus' value='0'>
            </div>
            <div class="input-group">
                <span class='input-group-addon'><b>Group 5 Bonus:</b></span><input type='text' name='group5bonus' class='form-control' id='group5bonus' value='0'>
            </div>
            <div class="input-group">
                <span class='input-group-addon'><b>Group 6 Bonus:</b></span><input type='text' name='group6bonus' class='form-control' id='group6bonus' value='0'>
            </div>
            <div class="input-group">
                <span class='input-group-addon'><b>Group 7 Bonus:</b></span><input type='text' name='group7bonus' class='form-control' id='group7bonus' value='0'>
            </div>
            <div class="input-group">
                <span class='input-group-addon'><b>Group 8 Bonus:</b></span><input type='text' name='group8bonus' class='form-control' id='group8bonus' value='0'>
            </div>
            <div class="input-group">
                <span class='input-group-addon'><b>Group 9 Bonus:</b></span><input type='text' name='group9bonus' class='form-control' id='group9bonus' value='0'>
            </div>
             <div class="input-group">
                <span class='input-group-addon'><b>Group 10 Bonus:</b></span><input type='text' name='group10bonus' class='form-control' id='group10bonus' value='0'>
            </div>
        </div>
    </div>
</div>
<br>
   

</body>
<script src="js/mapEditorRework.js?v6"></script>
<script src="js/mapEditorData.js?v6"></script>


</html>
   


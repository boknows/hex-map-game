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
    #help
    {
        border: 1px solid #FFFFFF;
        border-radius: 0.5em;
        background-color: #CCCCCC;
        box-shadow: inset 0 0 2px 1px rgba(0, 0, 0, 1), 0 0 2px 2px rgba(255, 255, 255, 0.25);
        padding: 0.5em;
    }
    *.btn.help {
        margin: 5px 5px 5px 0px;
    }

	</style>
</head>
<body>
<canvas id="HexCanvas" width="1200" height="900"></canvas>
<div class="container" id="panel">
    <div class="row">

        <div class="col-md-3">
            <button type="button" id ="helpBtn" class="btn btn-success help">Help</button><button class="btn btn-primary help" type="button" id="options">Show/Hide All Options</button>
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
                <button type="button" id ="updateRowCols" class="btn btn-primary help">Update Size of Map</button>
            </div>
            <div id="editMap">
                <div class="input-group">
                    <span class='input-group-addon'><b>Type:</b></span><select name='type' class='form-control' id='type'><option value='land'>Land</option><option value='forest'>Forest</option><option value='water'>Water</option><option value='desert'>Desert</option><option value='mountains'>Mountains</option><option value='artic'>Artic</option></select>
                </div>
                <div class="input-group">
                    <span class='input-group-addon'><b>Group:</b></span><input type='text' name='group' class='form-control' id='group' value=''>
                </div>
                <div class="input-group">
                    <span class='input-group-addon'><b>Neutral Owner at Start:</b></span><select name='neutral' id='neutral' class='form-control'><option value="false">No</option><option value="true">Yes</option></select>
                </div>
                <div class="input-group">
                    <span class='input-group-addon'><b>Neutral Units at Start:</b></span><input type='text' name='nUnits' id='nUnits' class='form-control'>
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
                <button type="button" id ="saveMap" class="btn btn-primary help">Save Map</button>
                <div class="input-group">
                    <span class='input-group-addon'><b>Load Map:</b></span><select type='text' name='loadMap' class='form-control' id='loadMap'></select>
                </div>
                <button type="button" id ="loadMapBtn" class="btn btn-primary help">Load</button>
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
<div id="help" class="row" style="position: absolute; left: calc(30% - 20em); right: calc(30% - 20em); top: calc(5%); background-color: #CCCCCC; display:none; z-index:1000;">
    <div class="col-md-12">
        <h1><u>Info</u></h1>
        <div class="row">
            <div class="col-md-12">
                <p><b>Groups:</b>  When you assign many hexes a group number, the player must occupy all hexes in that group to receive the group bonus. Please provide the group bonus amount for each group in the "Show/Hide Options" menu.</p>
                <p><b>Connectors:</b>  By default, hexagons can only move/attack other hexagons that are adjacent. To be able to attack across water, or anywhere other than adjacent, use the "Connector" tool. First, click the hex that you want to originate an attack/movement from. Then click the "select" button next to the "Connector" field. Your originating hex will be colored light blue. Every hexagon you click on after that, will turn red, signifying that you'll be able to attack/move to those hexes from the originating hex. Note: This is a one-way action. To attack/move to AND from a hex, you'll need to add connectors for both sides.</p>
                <p><b>Neutral Units:</b> By changing "Neutral Owner at Start" to a "Yes", you signify that at the beginning of a game, players will not occupy this hex. Dormant "neutral" units will be placed there insde. Enter the "Neutral Units at Start" to tell how many units are in the hex at the beginning of a game. Hexes can be designated as neutral AND be part of a continent bonus group.</p>
            </div>
        </div>
        <h1><u>Keyboard Shortcuts</u></h1>
        <div class="row">
            <div class="col-md-4">
                <h2>Borders (on numpad)</h2>
                <p>Black borders signify "continents" for bonuses. Green borders signify paths of travel.</p>
                <ul>
                    <li>'8' - Black Border on Northern edge</li>
                    <li>'9' - Black Border on North-eastern edge</li>
                    <li>'3' - Black Border on South-eastern edge</li>
                    <li>'2' - Black Border on Southern edge</li>
                    <li>'1' - Black Border on South-western edge</li>
                    <li>'7' - Black Border on North-western edge</li>
                    <li>'shift + 8' - Green Border on Northern edge</li>
                    <li>'shift + 9' - Green Border on North-eastern edge</li>
                    <li>'shift + 3' - Green Border on South-eastern edge</li>
                    <li>'shift + 2' - Green Border on Southern edge</li>
                    <li>'shift + 1' - Green Border on South-western edge</li>
                    <li>'shift + 7' - Green Border on North-western edge</li>
                </ul>
            </div>
            <div class="col-md-4">
                <h2>Terrain Types</h2>
                <ul>
                    <li>'w' - water</li>
                    <li>'l' - grassland</li>
                    <li>'m' - mountains</li>
                    <li>'f' - forest</li>
                    <li>'d' - desert</li>
                    <li>'a' - arctic</li>
                </ul>
            </div>
            <div class="col-md-4">
                <h2>Grouping (for bonuses)</h2>
                <ul>
                    <li>'1' - Group 1</li>
                    <li>'2' - Group 2</li>
                    <li>'3' - Group 3</li>
                    <li>etc</li>
                </ul>
            </div>

        </div>
        
        <div class='btn-group' role='group' aria-label='close'>
            <button class='btn btn-danger btn-large help' id='closeHelp' type='button'>Close</button>
        </div>
    </div>
</div>
<br>
   

</body>
<script src="js/mapEditorRework.js?r=".time().""></script>
<script src="js/mapEditorData.js?r=".time().""></script>


</html>


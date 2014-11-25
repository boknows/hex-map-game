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
        top: 50px;
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
                <button type="button" id ="updateRowCols" class="btn btn-success">Update Map</button>
            </div>
            <div id="editMap">
                <div class="input-group">
                <span class='input-group-addon'><b>Row:</b></span><input type='text' name='row' class='form-control' id='row' value=''>
                </div>
                <div class="input-group">
                <span class='input-group-addon'><b>Column:</b></span><input type='text' name='column' class='form-control' id='column' value=''>
                </div>
                <div class="input-group">
                <span class='input-group-addon'><b>Type:</b></span><select name='type' class='form-control' id='type'><option value='land'>Land</option><option value='forest'>Forest</option><option value='water'>Water</option><option value='desert'>Desert</option><option value='mountains'>Mountains</option></select>
                </div>
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
                <span class='input-group-addon'><b>Connect:</b></span><input type='text' name='connect' class='form-control' id='connect' value=''>
                </div>
                <div class="input-group">
                <span class='input-group-addon'><b>Group:</b></span><input type='text' name='group' class='form-control' id='group' value=''>
                </div>
                <button type="button" id ="updateMap" class="btn btn-success">Update Map</button>
                <br><button type="button" id ="saveMap" class="btn btn-success">Save Map</button>
            </div> 
        </div>
        <div class="col-md-9">
            
        </div>
    </div>
</div>
<br>
   

</body>
<script src="js/mapEditor2.js?v4"></script>


</html>
   


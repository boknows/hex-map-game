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
    <link href="css/onoffswitch.css" rel="stylesheet">

	<style>
	canvas {
		position: absolute;
		left: 300px;
		width: 1200px;
		height: 900px;
	}
    #panel {
        position: absolute;
        width: 400px;
    }

	</style>
</head>
<body>
	<input type="hidden" name="username" id="username" value="<?php echo $_SESSION['user']['username']; ?>">
	<input type="hidden" name="email" id="email" value="<?php echo $_SESSION['user']['email']; ?>">
<canvas id="HexCanvas" width="1200" height="900"></canvas>
<div class="container" id="panel">
    <div class="row">
        <div class="col-md-12" id="editMapRowsCols">
            <div class="input-group">
            <span class='input-group-addon'><b>Rows:</b></span><input type='text' name='rows' class='form-control' id='rows' value='10'>
            </div>
            <div class="input-group">
            <span class='input-group-addon'><b>Columns:</b></span><input type='text' name='cols' class='form-control' id='cols' value='10'>
            </div>
            <button type="button" id ="updateRowCols" class="btn btn-success">Update Map</button>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12" id="editMap">
            <div class="input-group">
            <span class='input-group-addon'><b>Row:</b></span><input type='text' name='row' class='form-control' id='row' value=''>
            </div>
			<div class="input-group">
            <span class='input-group-addon'><b>Column:</b></span><input type='text' name='column' class='form-control' id='column' value=''>
            </div>
			<div class="input-group">
            <span class='input-group-addon'><b>Type:</b></span><select name='type' class='form-control' id='type'><option value='land'>Land</option><option value='water'>Water</option></select>
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
        </div> 
	</div><br>
    <button type="button" id ="saveMap" class="btn btn-success">Save Map</button>
</div>
</body>
<script src="js/mapEditor2.js"></script>

<script>
$('#transfer').on('changed', function (evt, data) {
});
</script>
<script>
$('select[name="colorpicker"]').simplecolorpicker({theme: 'glyphicons'});
</script>
</html>
   


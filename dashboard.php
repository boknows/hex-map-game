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
    <script type="text/javascript" src="js/dashboard.js"></script>
    <script src="js/jquery.simplecolorpicker.js"></script>
    <link href="css/bootstrap-select.min.css" rel="stylesheet">
	<link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/jquery.simplecolorpicker.css">
    <link rel="stylesheet" href="css/jquery.simplecolorpicker-glyphicons.css">

</head>
<body>

<p>Welcome <?php echo htmlentities($_SESSION['user']['username'], ENT_QUOTES, 'UTF-8'); ?>!</p>
    <pre>
<?php 
print_r($_SESSION);
?>
</pre>
<h3>Active Games</h3>    
<table class="table table-striped" id="game_table" style="width: auto;">
</table>
<div class="container-fluid">
	<h3>Start New Game</h3>
    Choose your color:
        <div class="form-group">
            <div class="col-sm-6">
              <select name="colorpicker" id="colorpicker" class="form-control">
                <option value="#FF0000" selected>Red</option>
                <option value="#FF66FF">Pink</option>
                <option value="#FF6600">Orange</option>
                <option value="#FFFF00">Yellow</option>
                <option value="#33CC33">Green</option>
                <option value="#0000FF">Blue</option>
                <option value="#00FFFF">Teal</option>
                <option value="#AA70AA">Purple</option>
              </select>
            </div>
        </div>
        <div style="clear: both;"></div>
		<div class="input-group col-md-4">
		<span class='input-group-addon'><b>Game Name:</b></span><input type='text' name='name' class='form-control' id='name'>
		</div>
		<div class="input-group col-md-4">
		<span class='input-group-addon'><b>Opponent 1 Email:</b></span><input type='text' name='player1' class='form-control' id='player1'>
		</div>
		<div class="input-group col-md-4">
		<span class='input-group-addon'><b>Opponent 2 Email:</b></span><input type='text' name='player2' class='form-control' id='player2'>
		</div>
		<div class="input-group col-md-4">
		<span class='input-group-addon'><b>Opponent 3 Email:</b></span><input type='text' name='player3' class='form-control' id='player3'>
		</div>
		<div class="input-group col-md-4">
		<span class='input-group-addon'><b>Opponent 4 Email:</b></span><input type='text' name='player4' class='form-control' id='player4'>
		</div>
		<div class="input-group col-md-4">
		<span class='input-group-addon'><b>Opponent 5 Email:</b></span><input type='text' name='player5' class='form-control' id='player5'>
		</div>
		<div class="input-group col-md-4">
		<span class='input-group-addon'><b>Opponent 6 Email:</b></span><input type='text' name='player6' class='form-control' id='player6'>
		</div>
		<div class="input-group col-md-4">
		<span class='input-group-addon'><b>Opponent 7 Email:</b></span><input type='text' name='player7' class='form-control' id='player7'>
		</div>
		<div class='input-group'>
		<button class="btn btn-success btn-large" id='createGame' type='button' onclick=createGame() data-loading-text="Creating...">Create Game</button>
		</div>
        <input type="hidden" id="username" value="<?php echo $_SESSION['user']['email']; ?>">
</div>
<pre>
<?php
print_r($_SESSION['user']);
?>
</pre>
<script>
$('select[name="colorpicker"]').simplecolorpicker({theme: 'glyphicons'});
</script>
</body>
</html>
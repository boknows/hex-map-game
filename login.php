<?php 
    require("config.php"); 
    $submitted_username = ''; 
    if(!empty($_POST)){ 
		//echo "<pre>";
		//print_r($_POST);
		//echo "</pre>";
        $query = " 
            SELECT 
                id, 
                username, 
                password, 
                salt, 
                email 
            FROM users 
            WHERE 
                username = :username 
        "; 
        $query_params = array( 
            ':username' => $_POST['username'] 
        ); 
         
        try{ 
            $stmt = $db->prepare($query); 
            $result = $stmt->execute($query_params); 
        } 
        catch(PDOException $ex){ die("Failed to run query: " . $ex->getMessage()); } 
        $login_ok = false; 
        $row = $stmt->fetch(); 
        if($row){ 
            $check_password = hash('sha256', $_POST['password'] . $row['salt']); 
            for($round = 0; $round < 65536; $round++){
                $check_password = hash('sha256', $check_password . $row['salt']);
            } 
            if($check_password === $row['password']){
                $login_ok = true;
            } 
        } 

        if($login_ok){ 
            unset($row['salt']); 
            unset($row['password']); 
            $_SESSION['user'] = $row;  
            header("Location: hexagon.php"); 
            die("Redirecting to: hexagon.php"); 
        } 
        else{ 
            print("Login Failed."); 
            $submitted_username = htmlentities($_POST['username'], ENT_QUOTES, 'UTF-8'); 
        } 
    } 
?> 
<!DOCTYPE html>
<html>
<head>
    <title>Hex</title>
	<link href="css/bootstrap.min.css" rel="stylesheet">
	<script src='http://code.jquery.com/jquery-1.10.2.min.js' language='Javascript' type='text/javascript'></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
</head>
<body>

<form class="form-horizontal" method="post" action="login.php" id="login_form">
<!-- <div class="control-group">
	<label class="control-label" for="username">Email</label>
	<div class="controls">
		<input type="text" id="email" placeholder="Email">
	</div>
</div> -->
<div class="control-group">
	<label class="control-label" for="username">Username</label>
	<div class="controls">
		<input type="text" name="username" id="username" placeholder="Username">
	</div>
</div>
<div class="control-group">
	<label class="control-label" for="password">Password</label>
	<div class="controls">
		<input type="password" name="password" id="password" placeholder="Password">
	</div>
</div>
<div class="control-group">
	<div class="controls">
		<input name="Submit" type="submit" id="submit" value="Login" class="btn btn-success"/>
		<input type="reset" name="Reset" value="Reset" class="btn"/>
		<a href="register.php" name="Register" value="Register" class="btn btn-primary">Register</a>
	</div>
</div>
</form>

</body>
</html>
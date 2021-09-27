<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
 <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
<?php
include_once'connect.php';
session_start();

error_reporting(0);

if(isset($_POST['reg_user'])){
    
    $username=$_POST['username'];
    $phone=$_POST['phone'];
    $password=md5($_POST['password_1']);
    $confpassword=md5($_POST['password_2']);
    
    if(isset($_POST['username'])){
        
        $select=$pdo->prepare("select USERNAME from user where USERNAME='$username'");
        $select->execute();
        
        if($select->rowCount()>0){
             echo '<script type="text/javascript">
         
         jQuery(function validation(){
         
            swal({
            title: "Wrong Entry",
            text: "Username already exist! Please Try Again with different email Id",
            icon: "error",
            button: "Ok!",
            }); 
         
         });
        
         </script>';
            
        }else{
             $insert=$pdo->prepare("insert into user(USERNAME,PHONE,PASSWORD_HASH) values(:name,:phone,:pass)");
    
    $insert->bindParam(':name',$username);
    $insert->bindParam(':phone',$phone);
    $insert->bindParam(':pass',$password);
    
    if($password==$confpassword){
        
        if($insert->execute()){
             echo '<script type="text/javascript">
         
         jQuery(function validation(){
         
            swal({
            title: "Good job!'.$_SESSION['username'].'",
            text: "Registration is completed!!",
            icon: "success",
            button: "Ok!",
            }); 
         
         });
        
         </script>';
        }else{
            echo '<script type="text/javascript">
         
         jQuery(function validation(){
         
            swal({
            title: "Try Again",
            text: "Registration not completed!!",
            icon: "warning",
            button: "Ok!",
            }); 
         
         });
        
         </script>';
        }
    }else{
        echo '<script type="text/javascript">
         
         jQuery(function validation(){
         
            swal({
            title: "Wrong Entry",
            text: "Confirm password is different from password",
            icon: "error",
            button: "Ok!",
            }); 
         
         });
        
         </script>';
    }
            
        }
        
    }
   

}


?>



<!DOCTYPE html>
<html>
<head>
	<title>Registration system PHP and MySQL</title>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
	<div class="header">
		<h2>Register</h2>
	</div>
	
	<form method="post" action="register.php">

<!--		<?php include('errors.php'); ?>-->

		<div class="input-group">
			<label>Username</label>
			<input type="text" name="username" value="<?php echo $username; ?>">
		</div>
		<div class="input-group">
			<label>Phone</label>
			<input type="text" name="phone" value="<?php echo $email; ?>">
		</div>
		<div class="input-group">
			<label>Password</label>
			<input type="password" name="password_1">
		</div>
		<div class="input-group">
			<label>Confirm password</label>
			<input type="password" name="password_2">
		</div>
		<div class="input-group">
			<button type="submit" class="btn" name="reg_user">Register</button>
		</div>
		<p>
			Already a member? <a href="index.php">Sign in</a>
		</p>
	</form>
</body>
</html>
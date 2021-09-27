<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
 <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>

<?php
include_once'connect.php';

if(isset($_POST['login_user'])){
    
    $username=$_POST['username'];
    $password=md5($_POST['password']);
    
    $select=$pdo->prepare("select * from user where USERNAME='$username' AND PASSWORD_HASH='$password' ");
    
    $select->execute();
    
    $row=$select->fetch(PDO::FETCH_ASSOC);
    
    if($row['USERNAME']==$username AND $row['PASSWORD_HASH']==$password ){
         
             
             
        echo '<script type="text/javascript">
         
         jQuery(function validation(){
         
            swal({
            title: "Good job!",
            text: "Your Details Matched",
            icon: "success",
            button: "Ok!",
            }); 
         
         });
        
       </script>';
        //header('refresh:1;index.php'); 
             
        
          
       
    }else{
        echo '<script type="text/javascript">
         
         jQuery(function validation(){
         
            swal({
            title: "Try Again!",
            text: "Username or Password is wrong!",
            icon: "error",
            button: "Ok!",
            }); 
         
         });
        </script>';
        
  header('refresh:1;index.php');
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
		<h2>Login</h2>
	</div>
	
	<form method="post" action="">

<!--		<?php include('errors.php'); ?>-->

		<div class="input-group">
			<label>Email</label>
			<input type="text" name="username" >
		</div>
		<div class="input-group">
			<label>Password</label>
			<input type="password" name="password">
		</div>
		<div class="input-group">
			<button type="submit" class="btn" name="login_user">Login</button>
		</div>
		<p>
			Not yet a member? <a href="register.php">Sign up</a>
		</p>
	</form>


</body>
</html>
<?php
include 'opendb.php';
$username=$_POST['username'];
$email=$_POST['email'];
$password=$_POST['password'];
$firstname=$_POST['firstname'];
$lastname=$_POST['lastname'];
$gender=$_POST['gender'];
if(isset($_POST['username']))
{
$username = $_POST['username'];
$sql = mysql_query("select username from users where username='$username'");
if(mysql_num_rows($sql))
{
echo '<STRONG>'.$username.'</STRONG> is already in use.';
}
else
{
echo 'OK';
}
}
$sql="INSERT INTO `users`(`username`, `email`, `password`, `firstname`, `lastname`, `gender`) VALUES ('$username','$email','$password','$firstname','$lastname','$gender')"; 
mysqli_query($con,$sql);
echo "Successful";
header("location:../form.html");
?>
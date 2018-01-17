<?php
include 'opendb.php';
$mail=isset($_POST["login"]) ? $_POST["login"] : '';
$pass=isset($_POST["password"]) ? $_POST["password"] : '';
$sql="SELECT * FROM users where username='$mail' and password='$pass'";
if($mysqli_result=mysqli_query($con,$sql))
{
$count=mysqli_num_rows($mysqli_result);
}
if($count==1)
{
echo "Success";
header("location:../webcamera.html");
}
else 
{
echo $count;
echo "Login Not Successful";
header("Refresh: 2;log.php");
}
?>
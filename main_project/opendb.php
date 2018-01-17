<?php
// Create connection
$mysql_host = "localhost";
$mysql_database = "main";
$mysql_user = "root";
$mysql_password = "";
$con=mysqli_connect($mysql_host,$mysql_user,$mysql_password,$mysql_database);

// Check connection
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }
?>  
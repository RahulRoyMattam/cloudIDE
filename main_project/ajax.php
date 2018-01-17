<?php

include('opendb.php');


if(isset($_POST['username']))
{
$username = $_POST['username'];
$sql = mysqli_query($con,"select username from users where username='$username'");
if(mysqli_num_rows($sql))
{
echo '<STRONG>'.$username.'</STRONG> is already in use.';
}
else
{
echo 'Available';
}
}

?>
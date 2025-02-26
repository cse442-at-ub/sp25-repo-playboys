<?php
//database connection information for phpadmin sql database
//will need to be changed when connecting to live server
$host = "localhost";
$username = "root";
$password = "";
$database = "user_login_information"; //changed based on local or server sql database name
$port = 3306; //port number for sql database
// $database2 = "user_profile_information"; //changed based on local or server sql database name
// Create connection
$conn = new mysqli($host, $username, $password, $database, $port);
// $profile_conn = new mysqli($host, $username, $password, $database2, $port);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>

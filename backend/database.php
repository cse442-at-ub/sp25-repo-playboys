<?php
//database connection information for phpadmin sql database
//will need to be changed when connecting to live server

// for testing on local host use the following
$host = "localhost";
$username = "root";
$password = "";
$database = "user_login_information"; //sql database name

// $host = "localhost";
// $username = "";
// $password = "";
// $database = "user_login_information"; //sql database name

$port = 3307; //port number for sql database

// Create connection
$conn = new mysqli($host, $username, $password, $database, $port);


// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>

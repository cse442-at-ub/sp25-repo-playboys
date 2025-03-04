<?php
//database connection information for phpadmin sql database
//will need to be changed when connecting to live server
$host = "localhost";
$username = "root"; //change to ubit on live server
$password = ""; //change to your person number on live server
$database = "cse442_2025_spring_team_ah_db"; //sql database name

$port = 3306; //port number for sql database

// Create connection
$conn = new mysqli($host, $username, $password, $database, $port);


// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>

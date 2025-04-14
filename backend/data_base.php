<?php
require_once("config.php");
$config = include("config.php");
$ubit = $config['ubit'];
$person_number = $config['person_number'];
$host = "localhost";
$username = $ubit;
$password = $person_number;
$database = "cse442_2025_spring_team_ah_db"; //changed based on local or server sql database name
$port = 3306; //port number for sql database

// Create connection
$conn = new mysqli($host, $username, $password, $database, $port);



// Check connection
if ( $conn->connect_error ) 
{
    echo("Connection failed: " . $conn->connect_error);
}
?>
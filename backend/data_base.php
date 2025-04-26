<?php

//database connection information for phpadmin sql database
//will need to be changed when connecting to live server

// set $username and $passwrod from the username and password retuned in by config.php
$config = include __DIR__ . '/config.php';


$host = "localhost";
$username = $config['ubit'];
$password = $config['person_number'];
$database = "cse442_2025_spring_team_ah_db"; //changed based on local or server sql database name
$port = 3306; //port number for sql database

// Create connection
$conn = new mysqli($host, $username, $password, $database, $port);



// Check connection
if ( $conn->connect_error ) 
{
    die("Connection failed: " . $conn->connect_error);
}
?>
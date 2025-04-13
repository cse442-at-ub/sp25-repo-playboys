<?php

// Create password_resets table for forgot_password functionality:
/*
CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    code VARCHAR(16) NOT NULL,
    expires DATETIME NOT NULL
);
*/

//database connection information for phpadmin sql database
//will need to be changed when connecting to live server
$host = "localhost";
$username = "root";
$password = "";
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
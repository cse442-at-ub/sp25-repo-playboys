<?php
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "user_music_info";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}
?>

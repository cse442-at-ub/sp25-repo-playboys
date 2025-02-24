<?php
$host = "localhost";
$user = "root"; 
$pass = ""; 
$dbname = "user_music_info"; // Change depenfing on if group decides we need more than one db
$port = 8080;

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>

<?php
//database connection information for phpadmin sql database
//will need to be changed when connecting to live server
$host = "localhost";
$username = "root";
$password = "";
$user_info_db = "user_login_information"; //changed based on local or server sql database name
$port = 3306; //port number for sql database

// Create connection
$user_info_conn = new mysqli($host, $username, $password, $user_info_db);

// Check connection
if ($user_info_conn->connect_error) {
    die("Connection failed: " . $user_info_conn->connect_error);
}

?>

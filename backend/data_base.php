<?php

$host = "localhost";
$username = "root";
$password = "";
$user_info_db = "user_login_information";

//user login information database
$user_info_conn = new mysqli($host, $username, $password, $user_info_db);

if($user_info_conn->connect_error) {
    die("Connection failed: " . $user_info_conn->connect_error);
}
?>
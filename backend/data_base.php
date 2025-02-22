<?php
//database connection information for phpadmin sql database
//will need to be changed when connecting to live server
$host = "localhost";
$username = "root";
$password = "";
$user_info_db = "user_login_information";

//create instance of the sql database connection
$user_info_conn = new mysqli($host, $username, $password, $user_info_db);

?>
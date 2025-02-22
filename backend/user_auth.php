<?php

//Include data_base.php for mysql connection
require "data_base.php"; 

//Register Post Request (Create User)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $username = $_POST["username"];
    $password = $_POST["password"];
    $confirm_password = $_POST["confirm_password"];

    //salt and hash password
    $password = password_hash($password, PASSWORD_BCRYPT); 

    //prepare sql statement and bind parameters
    $insert_new_user = $user_info_conn->prepare("INSERT INTO user (email, username, password) VALUES (?, ?, ?)");
    $insert_new_user->bind_param("sss", $email, $username, $password);

    //insert newly registered user into database
    $insert_new_user->execute();

    //garbage collection
    $insert_new_user->close();
    $conn->close();
}



//Login Get Request 

?>
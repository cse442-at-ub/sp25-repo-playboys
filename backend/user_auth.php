<?php

//register function
function register($user_info_conn, $data) {
    //check if all required data is present
    if(!isset($data["email"]) || !isset($data["username"]) || !isset($data["password"]) || !isset($data["confirm_password"])) {
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit();
    }


    //trim and grab data sent from json object from router.php
    $email = trim($data["email"]);
    $username = trim($data["username"]);
    $password = trim($data["password"]);
    $confirm_password = trim($data["confirm_password"]);

    //check if password and confirm password matches
    if($password != $confirm_password) {
        echo json_encode(["status" => "error", "message" => "Passwords do not match."]);
        exit();
    }

    //salt and hash password
    $password = password_hash($password, PASSWORD_BCRYPT); 


    try {
        
        //prepare sql statement and bind parameters
        $insert_new_user = $user_info_conn->prepare("INSERT INTO register (email, username, password) VALUES (?, ?, ?)");
        $insert_new_user->bind_param("sss", $email, $username, $password);
    
        //insert newly registered user into database
        $insert_new_user->execute();
        echo json_encode(["status" => "success", "message" => "User registered successfully"]);
    
        //garbage collection
        $insert_new_user->close();
        $user_info_conn->close(); 

    }
    //catch duplicate entries
    catch(Exception $e) {
        if($e->getCode() === 1062) {
            echo json_encode(["status" => "error", "message" => "User already exists."]);
        }
        else {
            echo json_encode(["status" => "error", "message" => "An error occurred. Please try again."]);
        }

    }

}


//login function
function login($user_info_conn, $data) {

}









//Login Get Request 

?>
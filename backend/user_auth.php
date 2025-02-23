<?php

//register function
function register($user_info_conn, $data) {
    $missingFields = [];

    // Check each required field
    if (empty($data["email"])) {
        $missingFields[] = "email";
    }
    if (empty($data["username"])) {
        $missingFields[] = "username";
    }
    if (empty($data["password"])) {
        $missingFields[] = "password";
    }
    if (empty($data["confirm_password"])) {
        $missingFields[] = "confirm_password";
    }

    // If any fields are missing, return a detailed error message
    if (!empty($missingFields)) {
        echo json_encode([
            "status" => "error",
            "message" => "The following fields are required: " . implode(", ", $missingFields)
        ]);
        exit();
    }


    //trim and grab data sent from json object from router.php
    $email = trim($data["email"]);
    $username = trim($data["username"]);
    $password = $data["password"];
    $confirm_password = $data["confirm_password"];

    //check if password and confirm password matches
    if($password != $confirm_password) {
        echo json_encode(["status" => "error", "message" => "Passwords do not match."]);
        exit();
    }

    //salt and hash password
    $password = password_hash($password, PASSWORD_BCRYPT); 


    try {
        //prepare sql statement and bind parameters
        $insert_new_user = $user_info_conn->prepare("INSERT INTO user_login_data (email, username, password) VALUES (?, ?, ?)");
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
     //check if all required data is present
    if(!isset($data["username"]) || !isset($data["password"])) {
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit();
    }
    //trim and grab data sent from json object from router.php
    $username = trim($data["username"]);
    $password = $data["password"];


    //prepare sql statement and bind parameters
    $login_user = $user_info_conn->prepare("SELECT * FROM register WHERE username = ?");
    $login_user->bind_param("s", $username);
    $login_user->execute();
    $result = $login_user->get_result();
    
    //check if user exists
    if($result->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "User does not exist."]);
        exit();
    }

    //fetch user data
    $user = $result->fetch_assoc();


    //compare password hashes
    if(password_verify($password, $user["password"])) {
        echo json_encode(["status" => "success", "message" => "User logged in successfully"]);
    }
    else {
        echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
    }
}



?>
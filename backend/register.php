<?php

    require __DIR__ . "/headers.php";

    $method = $_SERVER["REQUEST_METHOD"]; // e.g. "POST"
    $data = json_decode(file_get_contents("php://input"), true); // decode JSON body
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

    $password = $data["password"];
    $confirm_password = $data["confirm_password"];
    //check if password and confirm password matches
    if($password != $confirm_password) {
        echo json_encode(["status" => "error", "message" => "Passwords do not match."]);
        exit();
    }

    $missingFields = [];
    if (strlen($password) < 8) {
        $missingFields[] = "at least 8 characters";
    }
    
    if (!preg_match("/[A-Z]/", $password)) {
        $missingFields[] = "at least one uppercase letter";
    }
    
    if (!preg_match("/[^\w\d\s]/", $password)) { // Checks for at least one special character
        $missingFields[] = "at least one special character";
    }
    
    if (!empty($missingFields)) {
        echo json_encode([
            "status" => "error",
            "message" => "Password must contain: " . implode(", ", $missingFields)
        ]);
        exit();
    }
    

    //trim and grab data sent from json object from router.php
    $email = trim($data["email"]);
    $username = trim($data["username"]);
    $followers = 0;
    $followings = 0;
    $friends = 0;
    $top_songs = "";
    $top_artists = "";
    $recent_activity = "";


    //salt and hash password
    $password = password_hash($password, PASSWORD_BCRYPT); 


    try {
        //prepare sql statement and bind parameters
        $insert_new_user = $conn->prepare("INSERT INTO user_login_data (email, username, password) VALUES (?, ?, ?)");
        $insert_new_user->bind_param("sss", $email, $username, $password);
    
        //insert newly registered user into database
        $insert_new_user->execute();

        //make new user profile table for new user
        $insert_new_profile = $conn->prepare("INSERT INTO user_profiles (username, email, friends, followers, followings, top_songs, top_artists, recent_activity) VALUES (?, ?, ? , ? , ? , ? , ? , ?)");
        $insert_new_profile->bind_param("ssssssss", $username, $email, $friends, $followers, $followings, $top_songs, $top_artists, $recent_activity);
        $insert_new_profile->execute();
        echo json_encode(["status" => "success", "message" => "User registered successfully"]);
    
        //garbage collection
        $insert_new_user->close();
        $conn->close(); 

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
?>
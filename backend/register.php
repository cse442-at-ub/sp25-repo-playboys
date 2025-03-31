<?php

    require __DIR__ . "/headers.php";
    require __DIR__ . "/userDatabaseGrabber.php";

    
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


    $username = trim($data["username"]);
    $email = trim($data["email"]);
    $password = $data["password"];
    $confirm_password = $data["confirm_password"];
    if(strlen($username) > 15){
        echo json_encode(["status" => "error", "message" => "Username too long, Please try again!"]);
        exit();
    } 
    if(!isValidEmail($email)){
        echo json_encode(["status" => "error", "message" => "Email Invalid. Please try again."]);
        exit();
    }
    if(strlen($email) > 254){
        echo json_encode(["status" => "error", "message" => "Email is invalid, Please try again!"]);
        exit();
    }
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
    
    $followers = 0;
    $followings = 0;
    $friends = 0;
    $top_songs = "";
    $top_artists = "";
    $recent_activity = "";
    $profile_pic = "";

    
    $missingFields = [];
    $check_username = $conn->prepare("SELECT * FROM user_login_data WHERE username = ?");
    $check_username->bind_param("s", $username);
    $check_username->execute();
    $result = $check_username->get_result();
    

    // if user doesnt exist we return an error
    if ($result->num_rows > 0) {
        $missingFields[] = "username";
    }
    $check_email = $conn->prepare("SELECT * FROM user_login_data WHERE email = ?");
    $check_email->bind_param("s", $email);
    $check_email->execute();
    $result = $check_email->get_result();
    if ($result->num_rows > 0) {
        $missingFields[] = "email";
    }

    if (!empty($missingFields)) {
        echo json_encode([
            "status" => "error",
            "message" => implode(", ", $missingFields) . " already in use"
        ]);
        exit();
    }
    
   
    //salt and hash password
    $password = password_hash($password, PASSWORD_BCRYPT); 
    try {
        //prepare sql statement and bind parameters
        $insert_new_user = $conn->prepare("INSERT INTO user_login_data (email, username, password) VALUES (?, ?, ?)");
        $insert_new_user->bind_param("sss", $email, $username, $password);
    
        //insert newly registered user into database
        $insert_new_user->execute();

        //make new user profile table for new user
        $insert_new_profile = $conn->prepare("INSERT INTO user_profiles (username, email, friends, followers, followings, top_songs, top_artists, recent_activity, profile_pic) VALUES (?, ?, ? , ? , ? , ? , ? , ?, ?)");
        $insert_new_profile->bind_param("sssssssss", $username, $email, $friends, $followers, $followings, $top_songs, $top_artists, $recent_activity, $profile_pic);
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
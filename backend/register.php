<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true"); // Only if using cookies
    header("Content-Type: application/json");
    $method = $_SERVER["REQUEST_METHOD"]; // e.g. "POST"
    $data = json_decode(file_get_contents("php://input"), true); // decode JSON body
    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
        http_response_code(200);
        exit();
    }
    require __DIR__ . "/data_base.php";
    require __DIR__ . "/user_auth.php";
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
        $insert_new_user = $conn->prepare("INSERT INTO user_login_data (email, username, password) VALUES (?, ?, ?)");
        $insert_new_user->bind_param("sss", $email, $username, $password);
    
        //insert newly registered user into database
        $insert_new_user->execute();
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
<?php
require_once "headers.php"; // If not already included
require_once "config.php";  // For $conn

if (!isset($_COOKIE["auth_token"])) {
    http_response_code(401);
    echo json_encode(["error" => "Auth token missing"]);
    exit();
}

$auth_token = $_COOKIE["auth_token"];

$stmt = $conn->prepare("SELECT username FROM cookie_authentication WHERE auth_key = ?");
$stmt->bind_param("s", $auth_token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid auth token"]);
    exit();
}

$row = $result->fetch_assoc();
$username = $row["username"]; // used in likeSong.php

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


function authenticateUser() {
    global $conn;

    if (!isset($_COOKIE["auth_token"])) {
        return ["authenticated" => false];
    }

    $auth_token = $_COOKIE["auth_token"];

    // Get username from token
    $stmt = $conn->prepare("SELECT username FROM cookie_authentication WHERE auth_key = ?");
    $stmt->bind_param("s", $auth_token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        return ["authenticated" => false];
    }

    $row = $result->fetch_assoc();
    $username = $row["username"];

    // Get spotify_id and access_token from user_login_data
    $stmt = $conn->prepare("SELECT spotify_id, access_token FROM user_login_data WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $userData = $stmt->get_result()->fetch_assoc();

    if (!$userData || empty($userData["spotify_id"]) || empty($userData["access_token"])) {
        return ["authenticated" => false];
    }

    return [
        "authenticated" => true,
        "spotify_id" => $userData["spotify_id"],
        "access_token" => $userData["access_token"]
    ];
}


?>
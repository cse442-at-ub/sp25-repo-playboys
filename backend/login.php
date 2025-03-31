<?php

    require __DIR__ . "/headers.php";


    $data = json_decode(file_get_contents("php://input"), true); // decode JSON body
    if (!isset($data["username"]) || !isset($data["password"])) {
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit();
    }
    $missingFields = [];
    $username = trim($data["username"]);
    $password = $data["password"];
    //check if the fields are empty and if they are tell user
    if (empty($username)) {
        $missingFields[] = "username";
    }
    if (empty($password)) {
        $missingFields[] = "password";
    }
    if (!empty($missingFields)) {
        echo json_encode([
            "status" => "error",
            "message" => "The following fields are required: " . implode(", ", $missingFields)
        ]);
        exit();
    }

    //verify that username exist
    $login_user = $conn->prepare("SELECT * FROM user_login_data WHERE username = ?");
    $login_user->bind_param("s", $username);
    $login_user->execute();
    $result = $login_user->get_result();

    // if user doesnt exist we return an error
    if ($result->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
        exit();
    }

    $user = $result->fetch_assoc();



    if (!password_verify($password, $user["password"])) {
        echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
        exit();
    } 
    try {
        //generate random token
        $token = bin2hex(random_bytes(32));
        $csrf_token = bin2hex(random_bytes(32));
        //add auth_key: will act as a token for user confirmation
        $delete_old_keys = $conn->prepare("DELETE FROM cookie_authentication WHERE username = ?");
        $delete_old_keys->bind_param("s", $username);
        $delete_old_keys->execute();
        $delete_old_keys->close();
        
        $insert_key = $conn->prepare("INSERT INTO cookie_authentication (username, auth_key, csrf_token) VALUES (?, ?, ?)");
        $insert_key->bind_param("sss", $username, $token, $csrf_token);
        $insert_key->execute();
        $insert_key->close();
        setcookie('auth_token', $token, [
            'expires' => time() + 3600,
            'path' => '/', 
            'HttpOnly' => true
        ]);

        echo json_encode(["status" => "success", "message" => "User logged in successfully", "csrf_token" => $csrf_token]);

        exit();

    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Failed to log in user."]);
        exit();

    }

    $conn->close();
    exit();
?>
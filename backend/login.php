<?php

    require __DIR__ . "/headers.php";


    $data = json_decode(file_get_contents("php://input"), true); // decode JSON body
    if (!isset($data["username"]) || !isset($data["password"])) {
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit();
    }

    $username = trim($data["username"]);
    $password = $data["password"];

    $login_user = $conn->prepare("SELECT * FROM user_login_data WHERE username = ?");
    $login_user->bind_param("s", $username);
    $login_user->execute();
    $result = $login_user->get_result();

    // if user doesnt exist we return an error
    if ($result->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "User does not exist."]);
        exit();
    }

    $user = $result->fetch_assoc();
    // if user exists we check if the password is correct and return a success message
    if (password_verify($password, $user["password"])) {
        echo json_encode(["status" => "success", "message" => "User logged in successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
    }

    exit();


?>
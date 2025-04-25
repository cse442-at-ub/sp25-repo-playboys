<?php

require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";
require __DIR__ . "/../communities_functions/community_db.php";

// get the data from the request
$data = json_decode(file_get_contents("php://input"), true);
$username = $data["username"] ?? null;
$email = $data["email"] ?? null;
$password = $data["password"] ?? null;

if (!$username || !$email || !$password) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

$storedHash = $result->fetch_assoc()["password"] ?? null;

if (!$storedHash) {
    echo json_encode(["status" => "error", "message" => "Username not found."]);
    exit;
}
else {
    echo json_encode(["status" => "success", "message" => "Valid Credentials"]);
    exit;
}


?>
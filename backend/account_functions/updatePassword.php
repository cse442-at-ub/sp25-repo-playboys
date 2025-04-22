<?php

require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";
require __DIR__ . "/../communities_functions/community_db.php";

// get the data from the request
$data = json_decode(file_get_contents("php://input"), true);
$username = $data["username"] ?? null;
$newPassword = $data["newPassword"] ?? null;
$newPassword2 = $data["newPassword2"] ?? null;

if (!$username || !$newPassword || !$newPassword2) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

if ($newPassword !== $newPassword2) {
    echo json_encode(["status" => "error", "message" => "Passwords do not match."]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

$newhash = password_hash($newPassword, PASSWORD_DEFAULT);
$stmt = $conn->prepare("UPDATE user_login_data SET password = ? WHERE username = ?");
$stmt->bind_param("ss", $newhash, $username);
$stmt->execute();
$stmt->close();

echo json_encode(["status" => "success", "message" => "Password updated successfully."]);
exit;
?>
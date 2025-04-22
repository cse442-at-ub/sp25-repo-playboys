<?php

require __DIR__ . "/../headers.php";
require __DIR__ . '/../config.php';
require __DIR__ . '/../sendmail.php';
require __DIR__ . '/../data_base.php';

// Get the incoming data
$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"] ?? null;

// Validate email input
if (!$email) {
    echo json_encode([
        "status" => "error",
        "message" => "Email not provided."
    ]);
    exit();
}

// Check if user exists
$get_users_id = $conn->prepare("SELECT id FROM user_login_data WHERE email = ?");
if (!$get_users_id) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error. Please try again later."
    ]);
    exit();
}

$get_users_id->bind_param("s", $email);
$get_users_id->execute();
$result = $get_users_id->get_result();

if ($result->num_rows === 0) {
    $get_users_id->close();
    echo json_encode([
        "status" => "error",
        "message" => "User not found with that email."
    ]);
    exit();
}

$user_data = $result->fetch_assoc();
$users_id = $user_data["id"];
$get_users_id->close();

// Clean up any existing reset requests
$delete_old_requests = $conn->prepare("DELETE FROM pwd_reset_requests WHERE users_id = ?");
if ($delete_old_requests) {
    $delete_old_requests->bind_param("i", $users_id);
    $delete_old_requests->execute();
    $delete_old_requests->close();
}


// Generate reset code and expiry
$code = strtoupper(bin2hex(random_bytes(4))); // 8-character alphanumeric
$expires = date("Y-m-d H:i:s", strtotime("+1 hour"));

// Store password reset request
$create_request = $conn->prepare("INSERT INTO pwd_reset_requests (users_id, code, expires) VALUES (?, ?, ?)");
if (!$create_request) {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to create password reset request."
    ]);
    exit();
}

$create_request->bind_param("iss", $users_id, $code, $expires);
$create_request->execute();
$create_request->close();

// Prepare and send the email
$email_subject = "Reset Your Password - Team Playboys";
$email_body = "<p>Your password reset code is: <strong>$code</strong><br><br>This code will expire in 1 hour.</p>";

if (!sendEmail($email, $email_subject, $email_body)) {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to send email. Please try again."
    ]);
    exit();
}

// Success
echo json_encode([
    "status" => "success",
    "message" => "Password reset email sent. Please check your inbox."
]);
exit();
?>

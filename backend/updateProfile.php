<?php
// Allow requests from any origin
require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuth.php";
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit();

}

$user = $result->fetch_assoc();
$username = $user["username"];
$email = $_POST['email'] ?? '';

if (empty($username) || empty($email)) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

// Update user profile data
$stmt = $conn->prepare("UPDATE user_profiles SET email = ? WHERE username = ?");
$stmt->bind_param("ss", $email, $username);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Profile updated successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update profile"]);
}

$stmt->close();

$conn->close();
?>
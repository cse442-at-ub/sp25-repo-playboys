<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'data_base.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
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
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}

$conn->close();
?>

<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Include database connection
include 'data_base.php';

// Read input from frontend
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (!isset($data['id']) || !isset($data['username']) || !isset($data['email'])) {
    die(json_encode(["error" => "Missing required fields"]));
}

// Sanitize inputs
$username = mysqli_real_escape_string($conn, $data['username']);
$email = mysqli_real_escape_string($conn, $data['email']);
$profile_pic = isset($data['profile_pic']) ? mysqli_real_escape_string($conn, $data['profile_pic']) : "";

// Update user profile in the database
$sql = "UPDATE users SET 
    email = '$email', 
    profile_pic = '$profile_pic',
    WHERE username = $uername";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["success" => "Profile updated successfully"]);
} else {
    echo json_encode(["error" => "Failed to update profile: " . mysqli_error($conn)]);
}

// Close connection
mysqli_close($conn);
?>

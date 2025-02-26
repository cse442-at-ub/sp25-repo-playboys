<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Include database connection
include 'db.php';

// Read input from frontend
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (!isset($data['id']) || !isset($data['username']) || !isset($data['email'])) {
    die(json_encode(["error" => "Missing required fields"]));
}

// Sanitize inputs
$user_id = intval($data['id']);
$username = mysqli_real_escape_string($conn, $data['username']);
$email = mysqli_real_escape_string($conn, $data['email']);
$profile_pic = isset($data['profile_pic']) ? mysqli_real_escape_string($conn, $data['profile_pic']) : "";
$friends_count = isset($data['friends_count']) ? intval($data['friends_count']) : 0;
$followers_count = isset($data['followers_count']) ? intval($data['followers_count']) : 0;
$following_count = isset($data['following_count']) ? intval($data['following_count']) : 0;

// Update user profile in the database
$sql = "UPDATE users SET 
    username = '$username', 
    email = '$email', 
    profile_pic = '$profile_pic',
    friends_count = $friends_count, 
    followers_count = $followers_count, 
    following_count = $following_count
    WHERE id = $user_id";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["success" => "Profile updated successfully"]);
} else {
    echo json_encode(["error" => "Failed to update profile: " . mysqli_error($conn)]);
}

// Close connection
mysqli_close($conn);
?>

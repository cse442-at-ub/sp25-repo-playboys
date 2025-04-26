<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

// Read JSON body
$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$song = $data['song'] ?? '';
$community = $data['community'] ?? '';
$media_path = $data['media_path'] ?? '';
$media_type = $data['media_type'] ?? '';

// Get username from cookie
$username = null;
if (isset($_COOKIE['auth_token'])) {
    $auth_token = $_COOKIE['auth_token'];
    $stmt = $conn->prepare("SELECT username FROM cookie_authentication WHERE auth_key = ?");
    $stmt->bind_param("s", $auth_token);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $username = $row['username'];
    }
}

// Handle missing user
if (!$username) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

// Validate fields
if (!$title || !$media_path || !$media_type || !$community) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields',
        'debug' => compact('title', 'media_path', 'media_type', 'community')
    ]);
    exit;
}

// Now insert into database
$stmt = $conn->prepare("INSERT INTO posts (username, title, description, song_name, media_path, media_type, community) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $username, $title, $description, $song, $media_path, $media_type, $community);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'DB Error: ' . $stmt->error]);
}
?>

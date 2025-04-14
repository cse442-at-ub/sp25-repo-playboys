<?php
require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuthHeader.php"; // sets $conn and verifies user

// Get current user ID from session (or fetch via auth_token)
$auth_token = $_COOKIE["auth_token"] ?? null;

if (!$auth_token) {
    echo json_encode(["status" => "error", "message" => "Missing auth token"]);
    exit;
}

// Get user ID
$stmt = $conn->prepare("SELECT id FROM user_login_data WHERE id = (
    SELECT user_id FROM cookie_authentication WHERE auth_key = ?
)");
$stmt->bind_param("s", $auth_token);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Invalid user"]);
    exit;
}
$user = $result->fetch_assoc();
$user_id = $user['id'];

// Read input
$data = json_decode(file_get_contents("php://input"), true);
$song_name = $data['song_name'] ?? null;
$artist_name = $data['artist_name'] ?? null;
$cover_url = $data['cover_url'] ?? null;
$preview_url = $data['preview_url'] ?? null;

if (!$song_name || !$artist_name) {
    echo json_encode(["status" => "error", "message" => "Missing song info"]);
    exit;
}

// Insert liked song
$stmt = $conn->prepare("INSERT INTO nonspotify_liked_songs (user_id, song_name, artist_name, cover_url, preview_url)
                        VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("issss", $user_id, $song_name, $artist_name, $cover_url, $preview_url);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Song liked"]);
} else {
    echo json_encode(["status" => "error", "message" => "DB insert failed"]);
}
?>

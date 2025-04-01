<?php
// CORS: handle preflight + main request
$allowed_origin = "http://localhost:3000";
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $allowed_origin) {
    header("Access-Control-Allow-Origin: $allowed_origin");
    header("Access-Control-Allow-Credentials: true");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    http_response_code(200);
    exit();
}

ini_set('session.cookie_samesite', 'Lax');
ini_set('session.cookie_secure', '0'); // Use '1' if you're running HTTPS

session_start();

require_once "config.php";
require_once "user_auth.php";
require_once "data_base.php";

// CORS headers for local dev
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === 'http://localhost:3000') {
    header("Access-Control-Allow-Origin: http://localhost:3000");
}
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Check if user is authenticated and get Spotify ID
$auth = authenticateUser();
if (!$auth["authenticated"]) {
    error_log("Auth failed: " . json_encode($_SESSION)); // Optional
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$spotify_id = $auth["spotify_id"];
$access_token = $auth["access_token"];

// Parse POST body
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["uri"])) {
    echo json_encode(["status" => "error", "message" => "Missing song URI"]);
    exit;
}
$song_uri = $data["uri"];

// Connect to database
$conn = getDB();

// Check if song already liked
$stmt = $conn->prepare("SELECT 1 FROM liked_songs WHERE spotify_id = ? AND song_uri = ?");
$stmt->bind_param("ss", $spotify_id, $song_uri);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    echo json_encode(["status" => "already_liked"]);
    exit;
}

// Get or create playlist for user
$stmt = $conn->prepare("SELECT playlist_id FROM user_login_data WHERE spotify_id = ?");
$stmt->bind_param("s", $spotify_id);
$stmt->execute();
$res = $stmt->get_result();
$row = $res->fetch_assoc();
$playlist_id = $row["playlist_id"] ?? null;

if (!$playlist_id) {
    $playlist_data = [
        "name" => "My Liked Songs from Playboys",
        "description" => "Songs you liked in the app",
        "public" => false
    ];
    $ch = curl_init("https://api.spotify.com/v1/users/$spotify_id/playlists");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $access_token",
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($playlist_data));
    $response = curl_exec($ch);
    curl_close($ch);
    $responseData = json_decode($response, true);

    if (!isset($responseData["id"])) {
        echo json_encode(["status" => "error", "message" => "Failed to create playlist"]);
        exit;
    }
    $playlist_id = $responseData["id"];

    // Save playlist_id to DB
    $update = $conn->prepare("UPDATE user_login_data SET playlist_id = ? WHERE spotify_id = ?");
    $update->bind_param("ss", $playlist_id, $spotify_id);
    $update->execute();
}

// Add song to playlist
$ch = curl_init("https://api.spotify.com/v1/playlists/$playlist_id/tracks");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $access_token",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["uris" => [$song_uri]]));
$response = curl_exec($ch);
curl_close($ch);

// Add to DB
$stmt = $conn->prepare("INSERT INTO liked_songs (spotify_id, song_uri) VALUES (?, ?)");
$stmt->bind_param("ss", $spotify_id, $song_uri);
$stmt->execute();

echo json_encode(["status" => "success", "playlist_id" => $playlist_id]);
?>

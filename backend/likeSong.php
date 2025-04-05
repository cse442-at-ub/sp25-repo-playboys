<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

session_start();

require_once "config.php";
require_once "user_auth.php";
require_once "data_base.php";

global $conn;

// Authenticate user
$auth = authenticateUser();
if (!$auth || !$auth["authenticated"]) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}
$spotify_id = $auth["spotify_id"];
$access_token = $auth["access_token"];

// Parse input safely
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);
if (!$data || !isset($data["uri"])) {
    echo json_encode(["error" => "Missing song URI"]);
    exit;
}
$song_uri = $data["uri"];

// Check if already liked
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
        echo json_encode(["error" => "Failed to create playlist"]);
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

<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "config.php";
require_once "headers.php";
require_once "user_auth.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$uri = $data["uri"] ?? null;
$name = $data["name"] ?? null;
$artist = $data["artist"] ?? null;
$album = $data["album"] ?? null;
$image = $data["image"] ?? null;

if (!$uri || !$name || !$artist || !$album || !$image) {
    http_response_code(400);
    echo json_encode(["error" => "Missing track info"]);
    exit;
}

// Get user’s Spotify info from DB
$stmt = $conn->prepare("SELECT spotify_id, access_token FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $username); // $username is set by user_auth.php
$stmt->execute();
$stmt->bind_result($spotify_id, $access_token);
$stmt->fetch();
$stmt->close();

if (!$spotify_id || !$access_token) {
    http_response_code(401);
    echo json_encode(["error" => "User not authenticated"]);
    exit;
}

// Step 1: Check/create playlist
$playlist_name = "Liked from SongRec";
$playlist_id = null;

$res = $conn->prepare("SELECT playlist_id FROM user_playlists WHERE spotify_id = ? LIMIT 1");
$res->bind_param("s", $spotify_id);
$res->execute();
$res->bind_result($playlist_id);
$res->fetch();
$res->close();

if (!$playlist_id) {
    // Get Spotify user ID
    $me = file_get_contents("https://api.spotify.com/v1/me", false, stream_context_create([
        "http" => [
            "method" => "GET",
            "header" => "Authorization: Bearer $access_token"
        ]
    ]));
    $userData = json_decode($me, true);
    $user_id = $userData["id"];

    // Create new playlist
    $playlistData = json_encode([
        "name" => $playlist_name,
        "public" => false,
        "description" => "Songs you liked in SongRec"
    ]);
    $context = stream_context_create([
        "http" => [
            "method" => "POST",
            "header" => "Authorization: Bearer $access_token\r\nContent-Type: application/json",
            "content" => $playlistData
        ]
    ]);
    $response = file_get_contents("https://api.spotify.com/v1/users/$user_id/playlists", false, $context);
    $playlistInfo = json_decode($response, true);
    $playlist_id = $playlistInfo["id"];

    // Save to DB
    $stmt = $conn->prepare("INSERT INTO user_playlists (spotify_id, playlist_id) VALUES (?, ?)");
    $stmt->bind_param("ss", $spotify_id, $playlist_id);
    $stmt->execute();
    $stmt->close();
}

// Step 2: Add song to Spotify playlist
$addTrackContext = stream_context_create([
    "http" => [
        "method" => "POST",
        "header" => "Authorization: Bearer $access_token\r\nContent-Type: application/json",
        "content" => json_encode(["uris" => [$uri]])
    ]
]);
file_get_contents("https://api.spotify.com/v1/playlists/$playlist_id/tracks", false, $addTrackContext);

// Step 3: Save to liked_songs DB
$stmt = $conn->prepare("INSERT IGNORE INTO liked_songs (spotify_id, uri, name, artist, album, image) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $spotify_id, $uri, $name, $artist, $album, $image);
$stmt->execute();
$stmt->close();

echo json_encode(["success" => true]);
?>

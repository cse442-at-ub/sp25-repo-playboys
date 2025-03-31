<?php
$allowedOrigins = [
    "http://localhost:3000",
    "http://localhost",
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
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

// Fetch access token from session
$access_token = $_SESSION["access_token"];
$spotify_id = $_SESSION["spotify_id"];
if (!$access_token || !$spotify_id) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}


// Step 1: Get or create the user's playlist
$playlist_name = "Liked from SongRec";
$playlist_id = null;

// Check if playlist already exists
$res = $conn->prepare("SELECT playlist_id FROM user_playlists WHERE spotify_id = ? LIMIT 1");
$res->bind_param("s", $spotify_id);
$res->execute();
$res->bind_result($playlist_id);
$res->fetch();
$res->close();

if (!$playlist_id) {
    // Create playlist on Spotify
    $userRes = file_get_contents("https://api.spotify.com/v1/me", false, stream_context_create([
        "http" => [
            "method" => "GET",
            "header" => "Authorization: Bearer $access_token"
        ]
    ]));
    $userData = json_decode($userRes, true);
    $user_id = $userData["id"];

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

    // Store it in DB
    $stmt = $conn->prepare("INSERT INTO user_playlists (spotify_id, playlist_id) VALUES (?, ?)");
    $stmt->bind_param("ss", $spotify_id, $playlist_id);
    $stmt->execute();
    $stmt->close();
}

// Step 2: Add track to Spotify playlist
$addTrackContext = stream_context_create([
    "http" => [
        "method" => "POST",
        "header" => "Authorization: Bearer $access_token\r\nContent-Type: application/json",
        "content" => json_encode(["uris" => [$uri]])
    ]
]);
file_get_contents("https://api.spotify.com/v1/playlists/$playlist_id/tracks", false, $addTrackContext);

// Step 3: Store in liked_songs DB table (if not already)
$stmt = $conn->prepare("INSERT IGNORE INTO liked_songs (spotify_id, uri, name, artist, album, image) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $spotify_id, $uri, $name, $artist, $album, $image);
$stmt->execute();
$stmt->close();

echo json_encode(["success" => true]);
?>

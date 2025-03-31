<?php

//For Local Testing
$allowedOrigins = [
    "http://localhost:3000",
    "https://se-dev.cse.buffalo.edu",
    "http://localhost"
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once("config.php");
require_once("database.php");

session_start();
if (!isset($_SESSION['username'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$username = $_SESSION['username'];

//Get access token from DB
$stmt = $conn->prepare("SELECT access_token FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$result || !$result['access_token']) {
    echo json_encode(["error" => "Access token not found"]);
    exit();
}

$token = $result['access_token'];

// Get liked song URIs
$likedUris = [];
$stmt = $conn->prepare("SELECT uri FROM liked_songs WHERE spotify_id = ?");
$stmt->bind_param("s", $spotify_id);
$stmt->execute();
$res = $stmt->get_result();
while ($row = $res->fetch_assoc()) {
    $likedUris[] = $row['uri'];
}
$stmt->close();

//Choose a random artist
$topArtistsUrl = "https://api.spotify.com/v1/me/top/artists?limit=5";
$topData = json_decode(file_get_contents($topArtistsUrl, false, stream_context_create([
    "http" => [
        "header" => "Authorization: Bearer $token"
    ]
])), true);

if (empty($topData['items'])) {
    echo json_encode(["error" => "No top artists found"]);
    exit();
}

$artist = $topData['items'][array_rand($topData['items'])];
$artistID = $artist['id'];

//Get top tracks for the artist
$tracksUrl = "https://api.spotify.com/v1/artists/$artistID/top-tracks?country=US";
$tracksData = json_decode(file_get_contents($tracksUrl, false, stream_context_create([
    "http" => [
        "header" => "Authorization: Bearer $token"
    ]
])), true);

// Find first previewable + not-liked track
$selectedTrack = null;
foreach ($tracksData['tracks'] as $track) {
    if (!empty($track['preview_url']) && !in_array($track['uri'], $likedUris)) {
        $selectedTrack = $track;
        break;
    }
}

if (!$selectedTrack) {
    echo json_encode(["error" => "No previewable or new track found"]);
    exit();
}

//Send back track data
echo json_encode([
    "name" => $selectedTrack['name'],
    "artist" => $selectedTrack['artists'][0]['name'],
    "album" => $selectedTrack['album']['name'],
    "preview_url" => $selectedTrack['preview_url'],
    "image" => $selectedTrack['album']['images'][0]['url'] ?? '',
    "genre" => "Top Track",
    "backgroundStory" => "Preview from one of {$selectedTrack['artists'][0]['name']}'s most streamed songs."
]);

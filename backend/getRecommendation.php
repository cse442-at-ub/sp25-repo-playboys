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
require_once("data_base.php");

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

if (!$result || !$result['access_token']) {
    echo json_encode(["error" => "Access token not found"]);
    exit();
}

$token = $result['access_token'];

//Choose a random artist
$artistList = ["Bring Me The Horizon", "Ariana Grande", "Taylor Swift", "Kendrick Lamar", "Billie Eilish"];
$chosenArtist = $artistList[array_rand($artistList)];

//Search Spotify for that artist
$searchUrl = "https://api.spotify.com/v1/search?q=" . urlencode($chosenArtist) . "&type=artist&limit=1";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $searchUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token"
]);
$searchResponse = curl_exec($ch);
curl_close($ch);

$searchData = json_decode($searchResponse, true);
if (empty($searchData['artists']['items'][0]['id'])) {
    echo json_encode(["error" => "Artist not found"]);
    exit();
}

$artistID = $searchData['artists']['items'][0]['id'];

//Get top tracks for the artist
$tracksUrl = "https://api.spotify.com/v1/artists/$artistID/top-tracks?country=US";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $tracksUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token"
]);
$tracksResponse = curl_exec($ch);
curl_close($ch);

$tracksData = json_decode($tracksResponse, true);
$selectedTrack = null;

foreach ($tracksData['tracks'] as $track) {
    if (!empty($track['preview_url'])) {
        $selectedTrack = $track;
        break;
    }
}

if (!$selectedTrack) {
    echo json_encode(["error" => "No preview found"]);
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

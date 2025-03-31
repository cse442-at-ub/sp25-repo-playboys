<?php
session_start();
header("Content-Type: application/json");
require_once 'config.php'; 

// Get the access token from the session
if (isset($_SESSION['access_token'])) {
    $accessToken = $_SESSION['access_token'];
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Access token not available. Please log in again."
    ]);
    exit;
}

// Get the artist parameter from the URL query string
$artistName = isset($_GET['artist']) ? $_GET['artist'] : '';
if (empty($artistName)) {
    echo json_encode([
        "status" => "error",
        "message" => "No artist provided."
    ]);
    exit;
}

// Use the Spotify Search API to get the artist's ID
$searchURL = "https://api.spotify.com/v1/search?" . http_build_query([
    'q'      => $artistName,
    'type'   => 'artist',
    'market' => 'US'
]);

$searchData = fetchDataWithToken($accessToken, $searchURL);
if (!isset($searchData['artists']['items'][0]['id'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Artist not found."
    ]);
    exit;
}
$artistID = $searchData['artists']['items'][0]['id'];

// Retrieve the artist's top tracks
$topTracksURL = "https://api.spotify.com/v1/artists/$artistID/top-tracks?market=US";
$topTracksData = fetchDataWithToken($accessToken, $topTracksURL);
if (!isset($topTracksData['tracks'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Unable to retrieve top tracks."
    ]);
    exit;
}
$topSongs = $topTracksData['tracks'];

// Build an array of up to 5 songs
$topSongsArr = [];
$count = 0;
foreach ($topSongs as $song) {
    if ($count >= 5) {
        break;
    }
    $topSongsArr[] = [
        'name'     => $song['name'],
        'duration' => $song['duration_ms'],
        'uri'      => $song['uri']
    ];
    $count++;
}

// Return the data as JSON
echo json_encode([
    "status"   => "success",
    "topSongs" => $topSongsArr
]);

// Helper function to make API calls with cURL
function fetchDataWithToken(string $accessToken, string $url): ?array {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $accessToken"
    ]);
    
    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        error_log('Request Error: ' . curl_error($ch));
        curl_close($ch);
        return null;
    }
    curl_close($ch);
    
    return json_decode($response, true);
}
?>

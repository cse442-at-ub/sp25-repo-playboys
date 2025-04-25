<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$genre = isset($_GET['genre']) ? $_GET['genre'] : '';
if (empty($genre)) {
    echo json_encode(["status" => "error", "message" => "No genre provided."]);
    exit;
}

$apiKey = "a70481ad121829a3431effe4024e89c2"; 

// Get top artists for the genre (tag)
$artistsUrl = "http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=" . urlencode($genre) . "&limit=5&api_key=$apiKey&format=json";
$artistsData = fetchFromLastFM($artistsUrl);
$topArtists = [];

if (isset($artistsData['topartists']['artist'])) {
    foreach ($artistsData['topartists']['artist'] as $artist) {
        $topArtists[] = $artist['name'];
    }
}

// Get top tracks for the genre (tag)
$tracksUrl = "http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=" . urlencode($genre) . "&limit=5&api_key=$apiKey&format=json";
$tracksData = fetchFromLastFM($tracksUrl);
$topSongs = [];

if (isset($tracksData['tracks']['track'])) {
    foreach ($tracksData['tracks']['track'] as $track) {
        $topSongs[] = [
            'name' => $track['name'],
            'artist' => $track['artist']['name'],
        ];
    }
}

// Output combined response
echo json_encode([
    "status" => "success",
    "topArtists" => $topArtists,
    "topSongs" => $topSongs
]);

function fetchFromLastFM($url): ?array {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
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

<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$apiKey = "a70481ad121829a3431effe4024e89c2";

// API endpoint for top artists
$artistUrl = "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key={$apiKey}&format=json";

// Fetch the data
$response = file_get_contents($artistUrl);
if ($response === false) {
    echo json_encode(['error' => 'Unable to fetch top artists data.']);
    exit;
}

// Decode the JSON response
$topArtistsData = json_decode($response, true);
if (!$topArtistsData || !isset($topArtistsData['artists']['artist'])) {
    echo json_encode(['error' => 'Invalid data received for top artists.']);
    exit;
}

// Sort the artists by descending listener count
usort($topArtistsData['artists']['artist'], function($a, $b) {
    return (int)$b['listeners'] - (int)$a['listeners'];
});

$result = $topArtistsData['artists']['artist'];

echo json_encode($result);
?>
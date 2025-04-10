<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$apiKey = "a70481ad121829a3431effe4024e89c2";

// API endpoint for top tags
$albumUrl = "http://ws.audioscrobbler.com/2.0/?method=chart.gettoptags&api_key={$apiKey}&format=json";

// Fetch the data
$response = file_get_contents($albumUrl);
if ($response === false) {
    echo json_encode(['error' => 'Unable to fetch top tags data.']);
    exit;
}

// Decode the JSON response
$topAlbumsData = json_decode($response, true);
if (!$topAlbumsData || !isset($topAlbumsData['tags']['tag'])) {
    echo json_encode(['error' => 'Invalid data received for top tags.']);
    exit;
}

// Sort the tags by descending listener count
usort($topAlbumsData['tags']['tag'], function($a, $b) {
    return (int)$b['reach'] - (int)$a['reach'];
});

$result = $topAlbumsData['tags']['tag'];

echo json_encode($result);
?>
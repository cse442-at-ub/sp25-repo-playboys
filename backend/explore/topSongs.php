<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$apiKey = "a70481ad121829a3431effe4024e89c2";

// API endpoint for top tracks
$trackUrl = "http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key={$apiKey}&format=json";

// Fetch the data
$response = file_get_contents($trackUrl);
if ($response === false) {
    echo json_encode(['error' => 'Unable to fetch top tracks data.']);
    exit;
}

// Decode the JSON response
$toptracksData = json_decode($response, true);
if (!$toptracksData || !isset($toptracksData['tracks']['track'])) {
    echo json_encode(['error' => 'Invalid data received for top tracks.']);
    exit;
}

// Sort the tracks by descending listener count
usort($toptracksData['tracks']['track'], function($a, $b) {
    return (int)$b['listeners'] - (int)$a['listeners'];
});

$result = $toptracksData['tracks']['track'];

echo json_encode($result);
?>
<?php

//For local testing
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
/////////////////////////////////////////////////////////////

session_start();
if (!isset($_SESSION['username'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

//Get top global tracks from Deezer
$chartUrl = "https://api.deezer.com/chart";
$chartResponse = file_get_contents($chartUrl);
$chartData = json_decode($chartResponse, true);

//Shuffle and find a track with a preview
$tracks = $chartData['tracks']['data'] ?? [];
shuffle($tracks);

$selectedTrack = null;
foreach ($tracks as $track) {
    if (!empty($track['preview'])) {
        $selectedTrack = $track;
        break;
    }
}

if (!$selectedTrack) {
    echo json_encode(["error" => "No preview available"]);
    exit();
}

//Return the selected track
echo json_encode([
    "name" => $selectedTrack['title'],
    "artist" => $selectedTrack['artist']['name'],
    "album" => $selectedTrack['album']['title'],
    "preview_url" => $selectedTrack['preview'], // 30s MP3
    "image" => $selectedTrack['album']['cover_big'],
    "genre" => "Top Chart",
    "backgroundStory" => "A Track from {$selectedTrack['artist']['name']} on Top Global Tracks",
    "deezer_link" => $selectedTrack['link']
]);
?>

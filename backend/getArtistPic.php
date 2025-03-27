<?php
header("Content-Type: application/json");

if (!isset($_COOKIE['spotify_access_token'])) {
    echo json_encode(['status' => 'error', 'message' => 'Access token missing']);
    exit;
}

$accessToken = $_COOKIE['spotify_access_token'];
$artist = urlencode($_GET['artist']);

$url = "https://api.spotify.com/v1/search?q={$artist}&type=artist&limit=1";
$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $accessToken"
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

if (!isset($data['artists']['items'][0])) {
    echo json_encode(['status' => 'error', 'message' => 'Artist not found']);
    exit;
}

$imageUrl = $data['artists']['items'][0]['images'][0]['url'] ?? null;

echo json_encode([
    'status' => 'success',
    'imageUrl' => $imageUrl
]);

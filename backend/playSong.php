<?php
// Enable CORS and JSON response
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Ensure POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Get the access token from the cookie
if (!isset($_COOKIE['spotify_access_token'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Spotify access token not found']);
    exit;
}

$accessToken = $_COOKIE['spotify_access_token'];

// Get song name and artist name from request body
$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['song_name']) || !isset($input['artist_name'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing song_name or artist_name']);
    exit;
}

$song = $input['song_name'];
$artist = $input['artist_name'];
$query = urlencode("track:$song artist:$artist");

$searchUrl = "https://api.spotify.com/v1/search?q={$query}&type=track&limit=10";

$ch = curl_init($searchUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $accessToken"
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Handle Spotify response
if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo json_encode(['status' => 'error', 'message' => 'Spotify API error', 'code' => $httpCode]);
    exit;
}

$data = json_decode($response, true);
$tracks = $data['tracks']['items'] ?? [];

foreach ($tracks as $track) {
    if (strcasecmp($track['name'], $song) === 0) {
        foreach ($track['artists'] as $trackArtist) {
            if (strcasecmp($trackArtist['name'], $artist) === 0) {
                $trackId = $track['id'];
                $embedUrl = "https://open.spotify.com/embed/track/" . $trackId;
                echo json_encode([
                    'status' => 'success',
                    'embedUrl' => $embedUrl
                ]);
                exit;
            }
        }
    }
}

echo json_encode(['status' => 'error', 'message' => 'No matching track found']);

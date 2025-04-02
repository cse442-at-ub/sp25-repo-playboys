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

// Get song name and artist name from request body
$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['song_name']) || !isset($input['artist_name'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing song_name or artist_name']);
    exit;
}

$song = $input['song_name'];
$artist = $input['artist_name'];

// Build query for Deezer: search by track title and artist name
$query = urlencode("track:\"$song\" artist:\"$artist\"");
$searchUrl = "https://api.deezer.com/search?q={$query}";

// Initialize cURL request to Deezer API
$ch = curl_init($searchUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Handle Deezer response errors
if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo json_encode(['status' => 'error', 'message' => 'Deezer API error', 'code' => $httpCode]);
    exit;
}

$data = json_decode($response, true);
$tracks = $data['data'] ?? [];

// Loop through returned tracks to find an exact match
foreach ($tracks as $track) {
    if (strcasecmp($track['title'], $song) === 0 && strcasecmp($track['artist']['name'], $artist) === 0) {
        $previewUrl = $track['preview']; // Deezer preview URL
        if ($previewUrl) {
            echo json_encode([
                'status' => 'success',
                'trackUrl' => $previewUrl
            ]);
            exit;
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Preview URL not available for this track'
            ]);
            exit;
        }
    }
}

echo json_encode(['status' => 'error', 'message' => 'No matching track found']);

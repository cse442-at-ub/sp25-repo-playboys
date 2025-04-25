<?php
header("Content-Type: application/json");
require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuthHeader.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$letters = range('a', 'z');
$randomLetter = $letters[array_rand($letters)];
$searchTerm = $randomLetter;
$searchTerm = chr(rand(97,122)) . chr(rand(97,122)); // random 2-letter combo

$searchUrl = "https://api.deezer.com/search?q=" . urlencode($searchTerm);

$ch = curl_init($searchUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
$tracks = $data['data'] ?? [];

if (empty($tracks)) {
    echo json_encode(['status' => 'error', 'message' => 'No tracks found']);
    exit;
}

$track = $tracks[array_rand($tracks)];
$previewUrl = $track['preview'] ?? null;
$coverUrl = $track['album']['cover_medium'] ?? null;

if (!$previewUrl) {
    echo json_encode(['status' => 'error', 'message' => 'Preview URL not available']);
    exit;
}

echo json_encode([
    'status' => 'success',
    'trackUrl' => $previewUrl,
    'song' => [
        'song_name' => $track['title'],
        'artist_name' => $track['artist']['name'],
        'cover_url' => $coverUrl
    ]
]);
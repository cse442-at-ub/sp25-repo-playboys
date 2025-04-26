<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once __DIR__ . "/access_token.php";

$apiKey = "a70481ad121829a3431effe4024e89c2";

// API endpoint for top artists
$artistUrl = "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key={$apiKey}&format=json";

// Fetch the data
$response = file_get_contents($artistUrl);
if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Unable to fetch top artists data.']);
    exit;
}

// Decode the JSON response
$topArtistsData = json_decode($response, true);
if (!$topArtistsData || !isset($topArtistsData['artists']['artist'])) {
    echo json_encode(['error' => 'Invalid data received for top artists.']);
    exit;
}

$artists = $topArtistsData['artists']['artist'];

/**
 * Fetch artist image from Spotify by searching artist name.
 * Returns URL string or null on failure.
 */
function fetchSpotifyArtistImage(string $artistName, string $token): ?string {
    $q   = urlencode($artistName);
    $url = "https://api.spotify.com/v1/search?q={$q}&type=artist&limit=1";

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER     => ["Authorization: Bearer $token"],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 5,
    ]);
    $resp = curl_exec($ch);
    curl_close($ch);

    if (!$resp) return null;
    $json = json_decode($resp, true);
    if (!empty($json['artists']['items'][0]['images'])) {
        $images = $json['artists']['items'][0]['images'];
        // Pick medium-size if available, otherwise first
        return $images[1]['url'] ?? $images[0]['url'];
    }
    return null;
}

// Build simplified array for frontend
$simplified = [];
foreach ($artists as $artist) {
    $name      = $artist['name'];
    $listeners = (int)$artist['listeners'];
    $image_url = null;

    // Try Spotify first
    if (!$spotify_access_token) {
        $fetched = fetchSpotifyArtistImage($name, $accessToken);
        if ($fetched) {
            $image_url = $fetched;
        }
    }

    // Fallback to Last.fm image array
    if (!$image_url && !empty($artist['image'])) {
        $last    = end($artist['image']);
        $image_url = $last['#text'];
    }

    // Final fallback: placeholder
    if (!$image_url) {
        $image_url = '';
    }

    $simplified[] = [
        'name'       => $name,
        'listeners'  => $listeners,
        'image_url'  => $image_url,
    ];
}

echo json_encode($simplified);
?>
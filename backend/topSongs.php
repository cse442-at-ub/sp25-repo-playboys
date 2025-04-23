<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
include_once "./access_token.php";

// Last.fm API key and endpoint for top tracks
$apiKey  = "a70481ad121829a3431effe4024e89c2";
$trackUrl = "http://ws.audioscrobbler.com/2.0/"
          . "?method=chart.gettoptracks"
          . "&api_key={$apiKey}"
          . "&format=json";

$response = file_get_contents($trackUrl);
if (!$response) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch Last.fm data']);
    exit;
}

$data = json_decode($response, true);
if (empty($data['tracks']['track'])) {
    echo json_encode([]);
    exit;
}

$tracks = $data['tracks']['track'];

/**
 * Fetch album art URL from Spotify by searching track+artist.
 * Returns URL string or null on failure.
 */
function fetchSpotifyImage(string $trackName, string $artistName, string $token): ?string {
    $q = urlencode("track:$trackName artist:$artistName");
    $url = "https://api.spotify.com/v1/search?q={$q}&type=track&limit=1";

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
    if (!empty($json['tracks']['items'][0]['album']['images'])) {
        $images = $json['tracks']['items'][0]['album']['images'];
        // Pick medium-size if available, otherwise first
        return $images[1]['url'] ?? $images[0]['url'];
    }
    return null;
}

// Build simplified array for frontend
$simplified = [];
foreach ($tracks as $track) {
    $name   = $track['name'];
    $artist = $track['artist']['name'];

    // Try Spotify
    $image_url = null;
    if ($spotify_access_token) {
        $fetched = fetchSpotifyImage($name, $artist, $spotify_access_token);
        if ($fetched) {
            $image_url = $fetched;
        }
    }

    // Fallback to Last.fm image
    if (!$image_url && !empty($track['image'])) {
        $lastImg   = end($track['image']);
        $image_url = $lastImg['#text'];
    }

    $simplified[] = [
        'name'      => $name,
        'artist'    => ['name' => $artist],
        'image_url' => $image_url,
    ];
}

echo json_encode($simplified);
?>
<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once "./access_token.php";  

//Fetch Last.fm top tracks 
$apiKey   = "a70481ad121829a3431effe4024e89c2";
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
$tracks = $data['tracks']['track'] ?? [];
if (empty($tracks)) {
    echo json_encode([]);
    exit;
}

// FAST SPEEDY LOOKUPS
$mh      = curl_multi_init();
$handles = [];

foreach ($tracks as $i => $track) {
    $trackName  = $track['name'];
    $artistName = $track['artist']['name'];
    $q          = urlencode("track:{$trackName} artist:{$artistName}");
    $url        = "https://api.spotify.com/v1/search?q={$q}&type=track&limit=1";

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 5,
        CURLOPT_HTTPHEADER     => ["Authorization: Bearer {$spotify_access_token}"],
    ]);
    curl_multi_add_handle($mh, $ch);
    $handles[$i] = $ch;
}

$running = null;
do {
    curl_multi_exec($mh, $running);
    curl_multi_select($mh);
} while ($running > 0);

// 4) Collect Spotify image URLs
$image_urls = [];
foreach ($handles as $i => $ch) {
    $resp = curl_multi_getcontent($ch);
    $json = json_decode($resp, true);

    if (!empty($json['tracks']['items'][0]['album']['images'])) {
        $images = $json['tracks']['items'][0]['album']['images'];
        // pick medium if available, otherwise first
        $image_urls[$i] = $images[1]['url'] ?? $images[0]['url'];
    } else {
        $image_urls[$i] = null;
    }

    curl_multi_remove_handle($mh, $ch);
}
curl_multi_close($mh);

$simplified = [];
foreach ($tracks as $i => $track) {
    $simplified[] = [
        'name'      => $track['name'],
        'artist'    => ['name' => $track['artist']['name']],
        'image_url' => $image_urls[$i],
    ];
}

echo json_encode($simplified);

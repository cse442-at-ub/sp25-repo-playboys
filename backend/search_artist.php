<?php
require __DIR__ . "/headers.php";
require __DIR__ ."/userDatabaseGrabber.php";
header('Content-Type: application/json');

$config = include __DIR__ . '/config.php';
$client_id = $config['spotify_client_id'];
$client_secret = $config['spotify_client_secret'];

# addding a new line to test the xamp_script

// Get access token
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://accounts.spotify.com/api/token');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'grant_type=client_credentials');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Basic ' . base64_encode("$client_id:$client_secret"),
    'Content-Type: application/x-www-form-urlencoded'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$token = json_decode($response)->access_token;

// Initialize results dictionary
$results = [
    'songs' => [],
    'albums' => [],
    'artists' => [],
    'events' => [],
];

if (isset($_GET['q'])) {
    $query = urlencode($_GET['q']);
    $apiResponse = file_get_contents(
        "https://api.spotify.com/v1/search?q=$query&type=track,artist,album",
        false,
        stream_context_create([
            'http' => ['header' => "Authorization: Bearer $token"]
        ])
    );
    
    $decodedResponse = json_decode($apiResponse, true);

    // Process tracks
    if (isset($decodedResponse['tracks']['items'])) {
        foreach ($decodedResponse['tracks']['items'] as $item) {
            $albumImages = $item['album']['images'] ?? [];
            $results['songs'][] = [
                'name' => $item['name'],
                'artists' => array_map(function($artist) { return $artist['name']; }, $item['artists']),
                'artist_names' => implode(', ', array_map(function($artist) { return $artist['name']; }, $item['artists'])),
                'album' => $item['album']['name'],
                'duration_ms' => $item['duration_ms'],
                'duration' => formatDuration($item['duration_ms']),
                'image_url' => $albumImages[0]['url'] ?? null,
                'spotify_url' => $item['external_urls']['spotify'],
                'id' => $item['id'],
                'popularity' => $item['popularity'],
                'type' => 'song'
            ];
        }
    }

    // Process artists
    if (isset($decodedResponse['artists']['items'])) {
        foreach ($decodedResponse['artists']['items'] as $item) {
            $artistImages = $item['images'] ?? [];
            $results['artists'][] = [
                'name' => $item['name'],
                'id' => $item['id'],
                'image_url' => $artistImages[0]['url'] ?? null,
                'spotify_url' => $item['external_urls']['spotify'],
                'genres' => $item['genres'] ?? [],
                'followers' => $item['followers']['total'] ?? 0,
                'popularity' => $item['popularity'] ?? 0,
                'type' => 'artist'
            ];
        }
    }

    // Process albums
    if (isset($decodedResponse['albums']['items'])) {
        foreach ($decodedResponse['albums']['items'] as $item) {
            $albumImages = $item['images'] ?? [];
            $results['albums'][] = [
                'name' => $item['name'],
                'artists' => array_map(function($artist) { return $artist['name']; }, $item['artists']),
                'artist_names' => implode(', ', array_map(function($artist) { return $artist['name']; }, $item['artists'])),
                'id' => $item['id'],
                'image_url' => $albumImages[0]['url'] ?? null,
                'spotify_url' => $item['external_urls']['spotify'],
                'release_date' => $item['release_date'],
                'total_tracks' => $item['total_tracks'],
                'type' => 'album'
            ];
        }
    }
}

    //Process events
    if (isset($_GET['q'])) {
        $event_q = trim($_GET['q']);
        $searchPattern = '%' . $conn->real_escape_string($event_q) . '%';
        $sql = "SELECT * 
        FROM artist_events
        WHERE title LIKE ? LIMIT 15";
        $stmt = $conn->prepare($sql);
        if($stmt){
            $stmt->bind_param("s", $searchPattern);
            $stmt->execute();
            $event_result = $stmt->get_result();
            $event_results = $event_result->fetch_all(MYSQLI_ASSOC);
            foreach(array_reverse($event_results) as $row){
                $results["events"][] = [
                    "date" => formatDateToMDY($row["date"]),
                    "time" => convertTo12Hour($row["time"]),
                    "location" => $row["location"],
                    "name" => $row["title"],
                    "artist" => $row["creator"],
                    "image" => $row["image_url"],
                    "id" => $row["id"],
                ];
            }
        }

    }

// Helper function to format duration
function formatDuration($ms) {
    $seconds = floor($ms / 1000);
    $minutes = floor($seconds / 60);
    $seconds = $seconds % 60;
    return sprintf("%d:%02d", $minutes, $seconds);
}

// Output the results as JSON
echo json_encode($results);
?>
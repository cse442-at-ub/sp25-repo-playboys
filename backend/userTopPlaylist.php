<?php

require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuthHeader.php";
require __DIR__ . "/userDatabaseGrabber.php";

$spotifyId = "";

// $result is from cookieAuth.php and is the username of the user
$user = $result->fetch_assoc();
$login_username = $user["username"];

if (isset($_GET['user'])) {
    if ($_GET['user'] != $login_username) {
        if ($_GET['user'] != '') {
            $stmt = $conn->prepare("SELECT spotify_id FROM user_login_data WHERE username = ?");
            $stmt->bind_param("s", $_GET['user']);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            $login_username = $_GET['user'];
        }
    }
}

// Grab token and spotify id from database
$stmt = $conn->prepare("SELECT access_token, spotify_id FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $login_username);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();
$access_token = $result['access_token'];
$spotifyId = $result['spotify_id'];

// If the user is not logged in with Spotify, fetch playlists from local database
if ($spotifyId == "" || $spotifyId == NULL) {
    $stmt = $conn->prepare("SELECT playlists FROM user_playlists WHERE username = ?");
    $stmt->bind_param("s", $login_username);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    if ($result && $result['playlists']) {
        // If playlists are stored in the database, output them directly.
        echo $result['playlists'];
        exit();
    } else {
        echo json_encode(["error" => "No playlists found for user"]);
        exit();
    }
}

$top_playlists_url = "https://api.spotify.com/v1/me/playlists?limit=10"; // Fetches top 10 playlists

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL            => $top_playlists_url,
    CURLOPT_HTTPHEADER     => ["Authorization: Bearer $access_token"],
    CURLOPT_RETURNTRANSFER => true
]);
$response = curl_exec($ch);
curl_close($ch);

$top_playlists = json_decode($response, true);

// Check if there's an error from the Spotify API
if (isset($top_playlists['error'])) {
    echo json_encode(["error" => $response]);
    exit();
}

// Prepare two arrays:
// 1. $playlistData: extended info for the database storage (includes 'songs')
// 2. $outputData: simplified output for the client (only 'name' and 'image')
$playlistData = [];
$outputData = [];

// Loop through each fetched playlist
foreach ($top_playlists['items'] as $playlist) {
    $name = $playlist['name'];
    $image = isset($playlist['images'][0]['url']) ? $playlist['images'][0]['url'] : '';
    $playlistId = $playlist['id'];
    
    // Create an empty array to hold songs
    $songs = [];
    
    // Build the URL to fetch the tracks for the given playlist (limiting to 5 songs; adjust limit as needed)
    $tracks_url = "https://api.spotify.com/v1/playlists/{$playlistId}/tracks?limit=5";
    
    // Initialize a new cURL session for fetching tracks
    $ch_tracks = curl_init();
    curl_setopt_array($ch_tracks, [
        CURLOPT_URL            => $tracks_url,
        CURLOPT_HTTPHEADER     => ["Authorization: Bearer $access_token"],
        CURLOPT_RETURNTRANSFER => true
    ]);
    $tracks_response = curl_exec($ch_tracks);
    curl_close($ch_tracks);
    
    $tracks_data = json_decode($tracks_response, true);
    
    // Check if there's an error fetching tracks; if so, leave songs empty.
    if (!isset($tracks_data['error']) && isset($tracks_data['items'])) {
        // Process each track item
        foreach ($tracks_data['items'] as $item) {
            if (isset($item['track']) && $item['track'] !== null) {
                $track = $item['track'];
                $songName = $track['name'];
                $trackId  = $track['id'];  // Spotify track ID
                
                // Extract artist names (join multiple artists with a comma)
                $artistNames = [];
                if (isset($track['artists'])) {
                    foreach ($track['artists'] as $artist) {
                        $artistNames[] = $artist['name'];
                    }
                }
                $artistStr = implode(', ', $artistNames);
                
                // Add the song to the songs array, including trackId
                $songs[] = [
                    "song"    => $songName,
                    "artist"  => $artistStr,
                    "trackId" => $trackId
                ];
            }
        }
    }
    
    // Build extended playlist info for database (with the songs array)
    $playlistData[] = [
        'name'  => $name,
        'image' => $image,
        'songs' => $songs
    ];
    
    // Build simplified output format for the client (only name and image)
    $outputData[] = [
        'name'  => $name,
        'image' => $image
    ];
}

// Convert extended playlist data to JSON string for database storage
$playlistsJson = json_encode($playlistData);

// Insert (or update) the playlists in the "user_playlists" table
$stmt = $conn->prepare("INSERT INTO user_playlists (username, playlists) VALUES (?, ?)
                        ON DUPLICATE KEY UPDATE playlists = VALUES(playlists)");
if (!$stmt) {
    echo json_encode(["error" => "Database prepare error: " . $conn->error]);
    exit();
}
$stmt->bind_param("ss", $login_username, $playlistsJson);
if (!$stmt->execute()) {
    echo json_encode(["error" => "Database execute error: " . $stmt->error]);
    exit();
}

// Output the playlists in the original simplified format (only name and image)
echo json_encode($outputData);
?>

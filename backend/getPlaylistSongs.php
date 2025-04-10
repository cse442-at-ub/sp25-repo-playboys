<?php
require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuthHeader.php";
require __DIR__ . "/userDatabaseGrabber.php";

$user = $result->fetch_assoc();
$login_username = $user["username"];

// Override with ?user=username if provided
if (isset($_GET['user']) && $_GET['user'] !== $login_username) {
    $requestedUser = $_GET['user'];
    if (!empty($requestedUser)) {
        $stmt = $conn->prepare("SELECT spotify_id FROM user_login_data WHERE username = ?");
        $stmt->bind_param("s", $requestedUser);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        if (!$result || empty($result['spotify_id'])) {
            echo json_encode(["status" => "error", "message" => "Visited profile isn't connected to Spotify"]);
            exit();
        }
        $login_username = $requestedUser;
    }
}

if (!isset($_GET['playlist'])) {
    echo json_encode(["status" => "error", "message" => "Missing playlist name"]);
    exit();
}
$targetPlaylistName = $_GET['playlist'];

// Fetch token and Spotify ID
$stmt = $conn->prepare("SELECT access_token, spotify_id FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $login_username);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();
$access_token = $result['access_token'];
$spotifyId = $result['spotify_id'];

if (empty($spotifyId)) {
    echo json_encode(["status" => "error", "message" => "User not linked with Spotify"]);
    exit();
}

// Fetch user's playlists
$playlistsUrl = "https://api.spotify.com/v1/me/playlists?limit=50";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $playlistsUrl,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer $access_token"],
    CURLOPT_RETURNTRANSFER => true
]);
$response = curl_exec($ch);
curl_close($ch);
$playlistsData = json_decode($response, true);

if (isset($playlistsData['error'])) {
    echo json_encode(["status" => "error", "message" => "Error fetching playlists", "details" => $playlistsData['error']]);
    exit();
}

// Match by playlist name
$playlistId = null;
foreach ($playlistsData['items'] as $playlist) {
    if (strcasecmp($playlist['name'], $targetPlaylistName) === 0) {
        $playlistId = $playlist['id'];
        break;
    }
}

if (!$playlistId) {
    echo json_encode(["status" => "error", "message" => "Playlist not found"]);
    exit();
}

// Fetch playlist tracks
$tracksUrl = "https://api.spotify.com/v1/playlists/$playlistId/tracks";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $tracksUrl,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer $access_token"],
    CURLOPT_RETURNTRANSFER => true
]);
$tracksResponse = curl_exec($ch);
curl_close($ch);
$tracksData = json_decode($tracksResponse, true);

if (!isset($tracksData['items'])) {
    echo json_encode(["status" => "error", "message" => "Failed to retrieve playlist songs"]);
    exit();
}

// Extract song info
$songs = [];
foreach ($tracksData['items'] as $item) {
    $track = $item['track'] ?? null;
    if ($track) {
        $songs[] = [
            "name" => $track['name'],
            "artist" => $track['artists'][0]['name'] ?? 'Unknown Artist',
            "duration" => $track['duration_ms'] ?? 0
        ];
    }
}

echo json_encode(["status" => "success", "songs" => $songs]);

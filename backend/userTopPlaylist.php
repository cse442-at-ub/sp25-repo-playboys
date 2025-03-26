<?php
/* Going to call Spotify API for user top playlists, if the user isn't logged in with Spotify, call Deezer API for a random playlist for now */

require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuthHeader.php";
require __DIR__ . "/userDatabaseGrabber.php";
/* grabbing spotify user_token from refresh_token.php */
session_start();

// Check if the user is logged in with Spotify
$is_login_with_spotify = 1;
if (!isset($_SESSION['spotify_uid'])) {
    $is_login_with_spotify = 0;
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$spotifyId = $_SESSION['spotify_uid'];

//$result is from cookieAuth.php and is the username of the user
$user = $result->fetch_assoc();
$login_username = $user["username"];

// Grab token from database
$stmt = $conn->prepare("SELECT access_token FROM user_login_data WHERE spotify_id = ?");
$stmt->bind_param("s", $spotifyId);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

$top_playlists_url = "https://api.spotify.com/v1/me/playlists?limit=10"; // Fetches top 10 playlists
$access_token = $result['access_token'];

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL            => $top_playlists_url,
    CURLOPT_HTTPHEADER     => ["Authorization: Bearer $access_token"],
    CURLOPT_RETURNTRANSFER => true
]);
$response = curl_exec($ch);
curl_close($ch);

$top_playlists = json_decode($response, true);

// Check if there's an error from Spotify API
if (isset($top_playlists['error'])) {
    echo json_encode(["error" => $response]);
    exit();
}

$data = [];
foreach ($top_playlists['items'] as $playlist) {
    $data[] = [
        'name' => $playlist['name'],
        'image' => $playlist['images'][0]['url'] // Fallback image URL
    ];
}

echo json_encode($data);
?>

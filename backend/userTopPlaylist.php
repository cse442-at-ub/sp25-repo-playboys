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
            if ($result == NULL) {
                echo json_encode(["error" => "Visited profile isn't logined with Spotify"]);
                exit();
            }
            if ($result['spotify_id'] == "" || $result['spotify_id'] == NULL) {
                echo json_encode(["error" => "Visited profile isn't logined with Spotify"]);
                exit();
            }
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
if ($spotifyId == "" || $spotifyId == NULL) {
    echo json_encode(["error" => "Please login with Spotify"]);
    exit();
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

// Create an array to store simplified playlist information as before
$data = [];
foreach ($top_playlists['items'] as $playlist) {
    $data[] = [
        'name'  => $playlist['name'],
        'image' => isset($playlist['images'][0]['url']) ? $playlist['images'][0]['url'] : ''
    ];
}

// Convert the array to a JSON string for database storage
$playlistsJson = json_encode($data);

// Insert (or update) the playlists into the "user_playlists" table
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

// Output the playlists in the original format
echo json_encode($data);
?>

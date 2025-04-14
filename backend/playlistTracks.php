<?php
// playlistTracks.php

require_once __DIR__ . "/cookieAuthHeader.php";

// Verify that both the 'user' and 'playlist' parameters are provided
if (!isset($_GET['user']) || !isset($_GET['playlist'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing parameters: user and playlist are required."
    ]);
    exit();
}

$username = $_GET['user'];
$playlistName = $_GET['playlist'];

// Prepare a query to get the user's playlists from the database
$stmt = $conn->prepare("SELECT playlists FROM user_playlists WHERE username = ?");
if (!$stmt) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $conn->error
    ]);
    exit();
}

$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

// If no playlists found for the user, return an error
if ($result->num_rows === 0) {
    echo json_encode([
        "status" => "error",
        "message" => "User not found or no playlists available."
    ]);
    exit();
}

// Retrieve the playlists JSON string from the database and decode it into an array
$row = $result->fetch_assoc();
$playlistsJson = $row['playlists'];
$playlistsArr = json_decode($playlistsJson, true);

if ($playlistsArr === null) {
    echo json_encode([
        "status" => "error",
        "message" => "Error decoding playlists JSON."
    ]);
    exit();
}

// Loop through the playlists and search for a match with the provided playlist name.
$foundPlaylist = null;
foreach ($playlistsArr as $playlist) {
    if (isset($playlist['name']) && strtolower($playlist['name']) === strtolower($playlistName)) {
        $foundPlaylist = $playlist;
        break;
    }
}

if (!$foundPlaylist) {
    echo json_encode([
        "status" => "error",
        "message" => "Playlist not found."
    ]);
    exit();
}

// Retrieve the songs from the found playlist. If no songs key exists, return an empty array.
$songs = isset($foundPlaylist['songs']) ? $foundPlaylist['songs'] : [];

echo json_encode([
    "status" => "success",
    "tracks" => $songs
]);
exit();
?>

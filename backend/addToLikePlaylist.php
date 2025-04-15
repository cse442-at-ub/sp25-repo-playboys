<?php
// addToLikePlaylist.php

require __DIR__ . "/headers.php";
require __DIR__ . "/data_base.php";
// Include cookieAuthHeader to handle authentication and retrieve the username
require __DIR__ . "/cookieAuthHeader.php";

// Retrieve the authenticated user's info from cookieAuthHeader.
$user = $result->fetch_assoc();
if (!isset($user['username'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Unable to retrieve username"
    ]);
    exit();
}
$username = $user["username"];

// Check that GET parameters exist
if (!isset($_GET['title']) || !isset($_GET['artist'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing title or artist"
    ]);
    exit();
}

$title  = trim($_GET['title']);
$artist = trim($_GET['artist']);

$playlistName = "My Liked Songs from Playboys";
$fillerImage  = "https://cdn.dribbble.com/userupload/20851422/file/original-b82fd38c350d47a4f8f4e689f609993a.png?resize=752x&vertical=center";

// Fetch the current playlists for the user from the "user_playlists" table
$stmt = $conn->prepare("SELECT playlists FROM user_playlists WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$resultRow = $stmt->get_result();
$playlistsData = [];
$userHasPlaylist = false;

if ($resultRow && $resultRow->num_rows > 0) {
    $row = $resultRow->fetch_assoc();
    $json = $row['playlists'];
    $playlistsData = json_decode($json, true);
    if (!is_array($playlistsData)) {
        $playlistsData = [];
    }
    $userHasPlaylist = true;
}

$playlistFound = false;
$duplicateFound = false; // flag to check for duplicate song

if (is_array($playlistsData)) {
    foreach ($playlistsData as &$playlist) {
        if (isset($playlist['name']) && $playlist['name'] === $playlistName) {
            $playlistFound = true;
            if (!isset($playlist['songs']) || !is_array($playlist['songs'])) {
                $playlist['songs'] = [];
            }
            // Check if song already exists in the playlist (case-insensitive check)
            foreach ($playlist['songs'] as $song) {
                if (strcasecmp($song['song'], $title) === 0 && strcasecmp($song['artist'], $artist) === 0) {
                    $duplicateFound = true;
                    break;
                }
            }
            if ($duplicateFound) {
                echo json_encode([
                    "status"  => "error",
                    "message" => "Song is already in the playlist."
                ]);
                exit();
            }
            // Add the new song as it is not a duplicate
            $playlist['songs'][] = [
                "song"   => $title,
                "artist" => $artist,
            ];
            break;
        }
    }
}
unset($playlist); 

// If the liked-songs playlist wasn't found, create a new playlist and add the song
if (!$playlistFound) {
    $newPlaylist = [
        "name"  => $playlistName,
        "image" => $fillerImage,
        "songs" => [
            [
                "song"   => $title,
                "artist" => $artist,
            ]
        ]
    ];
    $playlistsData[] = $newPlaylist;
}

// Encode the updated playlists data as JSON
$newPlaylistsJSON = json_encode($playlistsData);

if ($userHasPlaylist) {
    $updateStmt = $conn->prepare("UPDATE user_playlists SET playlists = ? WHERE username = ?");
    $updateStmt->bind_param("ss", $newPlaylistsJSON, $username);
    if ($updateStmt->execute()) {
        echo json_encode([
            "status"  => "success",
            "message" => "Playlist updated successfully."
        ]);
    } else {
        echo json_encode([
            "status"  => "error",
            "message" => "Failed to update playlist."
        ]);
    }
    $updateStmt->close();
} else {
    $insertStmt = $conn->prepare("INSERT INTO user_playlists (username, playlists) VALUES (?, ?)");
    $insertStmt->bind_param("ss", $username, $newPlaylistsJSON);
    if ($insertStmt->execute()) {
        echo json_encode([
            "status"  => "success",
            "message" => "Playlist created and song added successfully."
        ]);
    } else {
        echo json_encode([
            "status"  => "error",
            "message" => "Failed to create playlist."
        ]);
    }
    $insertStmt->close();
}

$conn->close();
?>

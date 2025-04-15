<?php
// addToLikePlaylist.php

require __DIR__ . "/cookieAuthHeader.php";

if (!isset($_POST['title']) || !isset($_POST['artist'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing title or artist"
    ]);
    exit();
}

$title  = trim($_POST['title']);
$artist = trim($_POST['artist']);

$username = "";
if (isset($result['username'])) {
    $username = $result['username'];
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Unable to retrieve username"
    ]);
    exit();
}

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

if (is_array($playlistsData)) {
    foreach ($playlistsData as &$playlist) {
        if (isset($playlist['name']) && $playlist['name'] === $playlistName) {
            $playlistFound = true;
            if (!isset($playlist['songs']) || !is_array($playlist['songs'])) {
                $playlist['songs'] = [];
            }
            $playlist['songs'][] = [
                "song"   => $title,
                "artist" => $artist,
            ];
            break;
        }
    }
}
unset($playlist); 

// If the liked-songs playlist wasn't found, add a new playlist object
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

<?php
// addToLikePlaylist.php

require __DIR__ . "/headers.php";
require __DIR__ . "/data_base.php";
// Include cookieAuthHeader to handle authentication and retrieve the username
require __DIR__ . "/cookieAuthHeader.php";


//Find an existing Spotify playlist by name, or return null.
function findSpotifyPlaylist($accessToken, $playlistName) {
    $url = "https://api.spotify.com/v1/me/playlists?limit=50";
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER     => ["Authorization: Bearer $accessToken"],
        CURLOPT_RETURNTRANSFER => true,
    ]);
    $resp = curl_exec($ch);
    curl_close($ch);
    $data = json_decode($resp, true);
    if (isset($data['items'])) {
        foreach ($data['items'] as $pl) {
            if (strcasecmp($pl['name'], $playlistName) === 0) {
                return $pl['id'];
            }
        }
    }
    return null;
}

// Search Spotify for a track by title + artist; return its URI or null.
function searchSpotifyTrack($accessToken, $title, $artist) {
    $q = rawurlencode("track:{$title} artist:{$artist}");
    $url = "https://api.spotify.com/v1/search?q={$q}&type=track&limit=1";
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER     => ["Authorization: Bearer $accessToken"],
        CURLOPT_RETURNTRANSFER => true,
    ]);
    $resp = curl_exec($ch);
    curl_close($ch);
    $data = json_decode($resp, true);
    if (!empty($data['tracks']['items'][0]['uri'])) {
        return $data['tracks']['items'][0]['uri'];
    }
    return null;
}

// Add a Spotify track URI to a playlist.
function addTrackToSpotifyPlaylist($accessToken, $playlistId, $trackUri) {
    $url = "https://api.spotify.com/v1/playlists/{$playlistId}/tracks";
    $body = json_encode(['uris' => [$trackUri]]);
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER     => [
            "Authorization: Bearer $accessToken",
            "Content-Type: application/json"
        ],
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $body,
        CURLOPT_RETURNTRANSFER => true,
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ($code >= 200 && $code < 300);
}

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
$playlistsData   = [];
$userHasPlaylist = false;

if ($resultRow && $resultRow->num_rows > 0) {
    $row           = $resultRow->fetch_assoc();
    $json          = $row['playlists'];
    $playlistsData = json_decode($json, true) ?: [];
    $userHasPlaylist = true;
}

// Insert into or update the JSON‑backed playlist
$playlistFound   = false;
$duplicateFound  = false;

foreach ($playlistsData as &$playlist) {
    if (isset($playlist['name']) && $playlist['name'] === $playlistName) {
        $playlistFound = true;
        $playlist['songs'] = $playlist['songs'] ?? [];
        // check duplicates
        foreach ($playlist['songs'] as $song) {
            if (strcasecmp($song['song'], $title) === 0 &&
                strcasecmp($song['artist'], $artist) === 0) {
                $duplicateFound = true;
                break 2;
            }
        }
        $playlist['songs'][] = ["song" => $title, "artist" => $artist];
        break;
    }
}
unset($playlist);

if ($duplicateFound) {
    echo json_encode([
        "status"  => "error",
        "message" => "Song is already in the playlist."
    ]);
    exit();
}

if (!$playlistFound) {
    $playlistsData[] = [
        "name"  => $playlistName,
        "image" => $fillerImage,
        "songs" => [
            ["song" => $title, "artist" => $artist]
        ]
    ];
}

$newPlaylistsJSON = json_encode($playlistsData);

// Insert back to DB
if ($userHasPlaylist) {
    $upd = $conn->prepare("UPDATE user_playlists SET playlists = ? WHERE username = ?");
    $upd->bind_param("ss", $newPlaylistsJSON, $username);
    $ok  = $upd->execute();
    $upd->close();
} else {
    $ins = $conn->prepare("INSERT INTO user_playlists (username, playlists) VALUES (?, ?)");
    $ins->bind_param("ss", $username, $newPlaylistsJSON);
    $ok  = $ins->execute();
    $ins->close();
}

// Integrate with Spotify if the user has one
$spotifyAdded = false;
$spotifyStmt = $conn->prepare("SELECT spotify_id, access_token FROM user_login_data WHERE username = ?");
$spotifyStmt->bind_param("s", $username);
$spotifyStmt->execute();
$loginResult = $spotifyStmt->get_result();
if ($loginResult && $loginResult->num_rows > 0) {
    $loginRow = $loginResult->fetch_assoc();
    if (!empty($loginRow['spotify_id']) && !empty($loginRow['access_token'])) {
        $token      = $loginRow['access_token'];
        // find or create playlist on Spotify
        $spPlaylistId = findSpotifyPlaylist($token, $playlistName);
        if ($spPlaylistId) {
            $trackUri = searchSpotifyTrack($token, $title, $artist);
            if ($trackUri) {
                $spotifyAdded = addTrackToSpotifyPlaylist($token, $spPlaylistId, $trackUri);
            }
        }
    }
}
$spotifyStmt->close();

$conn->close();

// Final response
$response = [
    "status"  => $ok ? "success" : "error",
    "message" => $ok
        ? "Playlist saved locally" . ($spotifyAdded ? " and added on Spotify." : " — Spotify skipped or failed.")
        : "Failed to save playlist locally."
];

echo json_encode($response);

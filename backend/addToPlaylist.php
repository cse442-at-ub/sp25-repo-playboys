<?php

require __DIR__ . "/headers.php";
require __DIR__ . "/data_base.php";
// Include cookieAuthHeader to handle authentication and retrieve the username
require __DIR__ . "/cookieAuthHeader.php";
require __DIR__ . "/usernameGrabber.php";

// Find an existing Spotify playlist by name, or return null.
function findSpotifyPlaylist($accessToken, $playlistName) {
    $url = "https://api.spotify.com/v1/me/playlists?limit=50";
    do {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => [
                "Authorization: Bearer $accessToken"
            ],
        ]);
        $resp = json_decode(curl_exec($ch), true);
        curl_close($ch);
        foreach ($resp['items'] as $pl) {
            if (strcasecmp($pl['name'], $playlistName) === 0) {
                return $pl['id'];
            }
        }
        $url = $resp['next']; 
    } while ($url);
    return null;
}

// Creates Spotify Playlist if one doesn't exist. Returns new playlist ID.
function createSpotifyPlaylist($accessToken, $userId, $playlistName) {
    $url = "https://api.spotify.com/v1/users/$userId/playlists";
    $body = json_encode([
        'name'   => $playlistName,
        'public' => false
    ]);
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $body,
        CURLOPT_HTTPHEADER     => [
            "Authorization: Bearer $accessToken",
            "Content-Type: application/json"
        ],
    ]);
    $resp = json_decode(curl_exec($ch), true);
    curl_close($ch);

    return $resp['id'];
}

// Looks up User ID based on access token.
function getCurrentUserId($accessToken) {
    $ch = curl_init("https://api.spotify.com/v1/me");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => [
            "Authorization: Bearer $accessToken"
        ],
    ]);
    $resp = json_decode(curl_exec($ch), true);
    curl_close($ch);
    return $resp['id'];
}

// Search Spotify for a track by title + artist; return its URI or null.
function searchSpotifyTrack($accessToken, $title, $artist) {
    $q   = rawurlencode("track:$title artist:$artist");
    $url = "https://api.spotify.com/v1/search?q=$q&type=track&limit=1";
    $ch  = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => [
            "Authorization: Bearer $accessToken"
        ],
    ]);
    $resp = json_decode(curl_exec($ch), true);
    curl_close($ch);

    if (!empty($resp['tracks']['items'])) {
        return $resp['tracks']['items'][0]['uri'];
    }
    return null;
}

// Add a Spotify track URI to a playlist.
function addTrackToSpotifyPlaylist($accessToken, $playlistId, $trackUri) {
    $url  = "https://api.spotify.com/v1/playlists/$playlistId/tracks";
    $body = json_encode(['uris' => [$trackUri]]);
    $ch   = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $body,
        CURLOPT_HTTPHEADER     => [
            "Authorization: Bearer $accessToken",
            "Content-Type: application/json"
        ],
    ]);
    $resp = json_decode(curl_exec($ch), true);
    curl_close($ch);

    return $resp;
}

$input = json_decode(file_get_contents('php://input'), true);
if (
    !is_array($input) ||
    !isset($input['playlist'], $input['song_title'], $input['artist_name'])
) {
    echo json_encode([
        "status"  => "error",
        "message" => "Missing playlist, song_title, or artist_name"
    ]);
    exit();
}

$playlistName = trim($input['playlist']);
$title        = trim($input['song_title']);
$artist       = trim($input['artist_name']);

// filler image for new playlists
$fillerImage = "https://cdn.dribbble.com/userupload/20851422/file/original-b82fd38c350d47a4f8f4e689f609993a.png?resize=752x&vertical=center";

// retrieve authenticated user
$user = $result->fetch_assoc();
if (!isset($user['username'])) {
    echo json_encode([
        "status"  => "error",
        "message" => "Unable to retrieve username"
    ]);
    exit();
}
$username = $user["username"];

// Fetch current playlists JSON from DB
$stmt = $conn->prepare("SELECT playlists FROM user_playlists WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$resultRow       = $stmt->get_result();
$playlistsData   = [];
$userHasPlaylist = false;

if ($resultRow && $resultRow->num_rows > 0) {
    $row             = $resultRow->fetch_assoc();
    $json            = $row['playlists'];
    $playlistsData   = json_decode($json, true) ?: [];
    $userHasPlaylist = true;
}
$stmt->close();

// find or create the named playlist, check for duplicate
$playlistFound  = false;
$duplicateFound = false;
foreach ($playlistsData as &$pl) {
    if (isset($pl['name']) && $pl['name'] === $playlistName) {
        $playlistFound        = true;
        $pl['songs']          = $pl['songs'] ?? [];
        foreach ($pl['songs'] as $song) {
            if (
                strcasecmp($song['song'], $title) === 0 &&
                strcasecmp($song['artist'], $artist) === 0
            ) {
                $duplicateFound = true;
                break 2;
            }
        }
        $pl['songs'][] = ["song" => $title, "artist" => $artist];
        break;
    }
}
unset($pl);

if ($duplicateFound) {
    echo json_encode([
        "status"  => "error",
        "message" => "Song is already in \"{$playlistName}\"."
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

// write back to DB
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

// --------------------
// Copy onto Spotify
// --------------------
$spotifyAdded = false;
$spotifyStmt  = $conn->prepare(
    "SELECT spotify_id, access_token FROM user_login_data WHERE username = ?"
);
$spotifyStmt->bind_param("s", $username);
$spotifyStmt->execute();
$loginResult = $spotifyStmt->get_result();

if ($loginResult && $loginResult->num_rows > 0) {
    $loginRow = $loginResult->fetch_assoc();
    if (!empty($loginRow['spotify_id']) && !empty($loginRow['access_token'])) {
        $token = $loginRow['access_token'];

        // 1) Find or create the Spotify playlist
        $spPlaylist = findSpotifyPlaylist($token, $playlistName);
        if (!$spPlaylist) {
            $spUserId   = getCurrentUserId($token);
            $spPlaylist = createSpotifyPlaylist($token, $spUserId, $playlistName);
        }

        // 2) Search for the track
        if ($spPlaylist) {
            $trackUri = searchSpotifyTrack($token, $title, $artist);
            // 3) Add it to the Spotify playlist
            if ($trackUri) {
                $addResp = addTrackToSpotifyPlaylist($token, $spPlaylist, $trackUri);
                if (isset($addResp['snapshot_id'])) {
                    $spotifyAdded = true;
                }
            }
        }
    }
}
$spotifyStmt->close();
$conn->close();

// final response
$response = [
    "status"  => $ok ? "success" : "error",
    "message" => $ok
        ? "Saved locally" . ($spotifyAdded
            ? " and added on Spotify."
            : " (Spotify skipped or failed.)")
        : "Failed to save locally."
];

echo json_encode($response);

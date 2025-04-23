<?php

require __DIR__ . "/headers.php";
require __DIR__ . "/data_base.php";
// Include cookieAuthHeader to handle authentication and retrieve the username
require __DIR__ . "/cookieAuthHeader.php";
include "./userDatabaseGrabber.php";

header('Content-Type: application/json');

// Find a Spotify playlist by name and returns ID (or "" if not existing).
function getSpotifyPlaylistId(string $accessToken, string $userId, string $playlistName): string
{
    $url = "https://api.spotify.com/v1/users/{$userId}/playlists?limit=50";
    do {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer {$accessToken}",
                "Content-Type: application/json"
            ],
        ]);

        $raw = curl_exec($ch);
        if ($raw === false) {
            curl_close($ch);
            return "";
        }

        $data = json_decode($raw, true);
        curl_close($ch);

        if (!isset($data['items']) || !is_array($data['items'])) {
            return "";
        }

        foreach ($data['items'] as $playlist) {
            if (
                isset($playlist['name'], $playlist['id']) &&
                strcasecmp($playlist['name'], $playlistName) === 0
            ) {
                return $playlist['id'];
            }
        }

        $url = !empty($data['next']) ? $data['next'] : null;
    } while ($url);
    return "";
}

// Creates new Spotify Playlist. Returns new playlist ID.
function createSpotifyPlaylist(string $accessToken, string $userId, string $playlistName, bool $public = false, string $description = ""): string
{
    $url = "https://api.spotify.com/v1/users/{$userId}/playlists";
    $payload = json_encode([
        'name' => $playlistName,
        'public' => $public,
        'description' => $description
    ]);
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer {$accessToken}",
            "Content-Type: application/json"
        ],
        CURLOPT_POSTFIELDS => $payload,
    ]);
    $raw = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);
    if ($raw === false || $err) {
        return "";
    }
    $data = json_decode($raw, true);
    if (isset($data['id'])) {
        return $data['id'];
    }

    return "";
}

// Add a Spotify track URI to a playlist.
function addTrackToPlaylist(string $accessToken, string $playlistId, string $trackId): string
{
    $url = "https://api.spotify.com/v1/playlists/{$playlistId}/tracks";
    $payload = json_encode([
        'uris' => ["spotify:track:{$trackId}"]
    ]);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer {$accessToken}",
            "Content-Type: application/json"
        ],
        CURLOPT_POSTFIELDS => $payload,
    ]);

    $raw = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($raw === false || $err) {
        return "";
    }

    $data = json_decode($raw, true);
    return isset($data['snapshot_id']) ? $data['snapshot_id'] : "";
}

// Retrieve all track IDs from a Spotify playlist.
function getPlaylistTrackIds(string $accessToken, string $playlistId): array
{
    $url = "https://api.spotify.com/v1/playlists/{$playlistId}/tracks?fields=items(track(id)),next&limit=100";
    $trackIds = [];
    do {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer {$accessToken}",
                "Content-Type: application/json"
            ],
        ]);
        $raw = curl_exec($ch);
        curl_close($ch);
        if ($raw === false) {
            break;
        }
        $data = json_decode($raw, true);
        if (empty($data['items']) || !is_array($data['items'])) {
            break;
        }
        foreach ($data['items'] as $item) {
            if (!empty($item['track']['id'])) {
                $trackIds[] = $item['track']['id'];
            }
        }
        $url = !empty($data['next']) ? $data['next'] : null;
    } while ($url);
    return $trackIds;
}

// Search and return a matching track ID (or "" if none found).
function findTrackId(string $accessToken, string $songName, string $artistsCsv): string
{
    $artistTerms = array_map('trim', explode(',', $artistsCsv));
    $queryParts = ["track:{$songName}"];
    foreach ($artistTerms as $artist) {
        if ($artist !== '') {
            $queryParts[] = "artist:{$artist}";
        }
    }
    $q = rawurlencode(implode(' ', $queryParts));
    $url = "https://api.spotify.com/v1/search?q={$q}&type=track&limit=10";

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer {$accessToken}",
            "Content-Type: application/json"
        ],
    ]);

    $response = curl_exec($ch);
    if ($response === false) {
        curl_close($ch);
        return "";
    }
    $data = json_decode($response, true);
    curl_close($ch);

    if (empty($data['tracks']['items']) || !is_array($data['tracks']['items'])) {
        return "";
    }

    $normalize = function (string $s): string {
        $noParen = preg_replace('/\s*\(.*?\)\s*/', ' ', $s);
        $clean = preg_replace('/[^\w\s]/u', ' ', $noParen);
        $lower = mb_strtolower($clean, 'UTF-8');
        return preg_replace('/\s+/', ' ', trim($lower));
    };

    $targetName = $normalize($songName);
    $targetArtists = array_map(function ($a) use ($normalize) {
        return $normalize($a);
    }, $artistTerms);

    foreach ($data['tracks']['items'] as $item) {
        if (empty($item['id']) || empty($item['name']) || empty($item['artists'])) {
            continue;
        }

        $itemName = $normalize($item['name']);
        if (strpos($itemName, $targetName) === false && strpos($targetName, $itemName) === false) {
            continue;
        }

        $itemArtists = array_map(function ($a) use ($normalize) {
            return $normalize($a['name'] ?? '');
        }, $item['artists']);
        $allMatch = true;
        foreach ($targetArtists as $tArtist) {
            if ($tArtist === '')
                continue;
            $found = false;
            foreach ($itemArtists as $ia) {
                if (strpos($ia, $tArtist) !== false || strpos($tArtist, $ia) !== false) {
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $allMatch = false;
                break;
            }
        }
        if ($allMatch) {
            return $item['id'];
        }
    }
    return "";
}


$input = json_decode(file_get_contents('php://input'), true);
if (
    !is_array($input) ||
    !isset($input['playlist'], $input['song_title'], $input['artist_name'])
) {
    echo json_encode(["status" => "error", "message" => "Missing playlist, song_title, or artist_name"]);
    exit();
}

$playlistName = trim($input['playlist']);
$title = trim($input['song_title']);
$artist = trim($input['artist_name']);

$userStmt = $conn->prepare("SELECT spotify_id, access_token FROM user_login_data WHERE username = ?");
$username = null;
if (isset($result) && $result instanceof mysqli_result) {
    $tmp = $result->fetch_assoc();
    $username = $tmp['username'] ?? null;
}
if (!$username) {
    echo json_encode(["status" => "error", "message" => "Unable to retrieve username"]);
    exit();
}

$userStmt->bind_param("s", $username);
$userStmt->execute();
$loginResult = $userStmt->get_result();
$isUserToken = false;
$spotifyUserId = null;
if ($loginResult && $loginResult->num_rows > 0) {
    $row = $loginResult->fetch_assoc();
    if ($row['spotify_id'] !== null && $row['access_token'] !== null) {
        $spotify_access_token = $row['access_token'];
        $spotifyUserId = $row['spotify_id'];
        $isUserToken = true;
    }
}
if (!isset($spotify_access_token)) {
    include __DIR__ . "/access_token.php"; // generic non-user token
}
$userStmt->close();

$dbStmt = $conn->prepare("SELECT playlists FROM user_playlists WHERE username = ?");
$dbStmt->bind_param("s", $username);
$dbStmt->execute();
$resultRow = $dbStmt->get_result();
$playlistsData = [];
$userHasPlaylist = false;
if ($resultRow && $resultRow->num_rows > 0) {
    $row = $resultRow->fetch_assoc();
    $playlistsData = json_decode($row['playlists'], true) ?: [];
    $userHasPlaylist = true;
}
$dbStmt->close();

$fillerImage = "https://cdn.dribbble.com/userupload/20851422/file/original-b82fd38c350d47a4f8f4e689f609993a.png";
$playlistFound = false;
$duplicateFound = false;
foreach ($playlistsData as &$pl) {
    if (isset($pl['name']) && $pl['name'] === $playlistName) {
        $playlistFound = true;
        $pl['songs'] = $pl['songs'] ?? [];
        foreach ($pl['songs'] as $song) {
            if (strcasecmp($song['song'], $title) === 0 && strcasecmp($song['artist'], $artist) === 0) {
                $duplicateFound = true;
                break 2;
            }
        }
        $trackId = findTrackId($spotify_access_token, $title, $artist);
        $pl['songs'][] = [
            "song" => $title,
            "artist" => $artist,
            "trackId" => $trackId
        ];
        break;
    }
}
unset($pl);

if ($duplicateFound) {
    echo json_encode(["status" => "error", "message" => "Song is already in \"{$playlistName}\"."]);
    exit();
}
if (!$playlistFound) {
    $trackId = findTrackId($spotify_access_token, $title, $artist);
    $playlistsData[] = [
        "name" => $playlistName,
        "image" => $fillerImage,
        "songs" => [["song" => $title, "artist" => $artist, "trackId" => $trackId]]
    ];
}

$newPlaylistsJSON = json_encode($playlistsData);

// Write back to local DB
if ($userHasPlaylist) {
    $upd = $conn->prepare("UPDATE user_playlists SET playlists = ? WHERE username = ?");
    $upd->bind_param("ss", $newPlaylistsJSON, $username);
    $ok = $upd->execute();
    $upd->close();
} else {
    $ins = $conn->prepare("INSERT INTO user_playlists (username, playlists) VALUES (?, ?)");
    $ins->bind_param("ss", $username, $newPlayListsJSON);
    $ok = $ins->execute();
    $ins->close();
}

// --------------------
// Sync to Spotify
// --------------------
$spotifyAdded = false;
if ($isUserToken) {
    $spotifyPlaylistId = getSpotifyPlaylistId($spotify_access_token, $spotifyUserId, $playlistName);
    if (!$spotifyPlaylistId) {
        $spotifyPlaylistId = createSpotifyPlaylist($spotify_access_token, $spotifyUserId, $playlistName);
    }
    if ($spotifyPlaylistId) {
        $existingIds = getPlaylistTrackIds($spotify_access_token, $spotifyPlaylistId);
        $localIds = [];
        foreach ($playlistsData as $pl) {
            if ($pl['name'] === $playlistName) {
                foreach ($pl['songs'] as $song) {
                    if (!empty($song['trackId'])) {
                        $localIds[] = $song['trackId'];
                    }
                }
                break;
            }
        }
        $toAdd = array_diff($localIds, $existingIds);
        foreach ($toAdd as $tid) {
            if (addTrackToPlaylist($spotify_access_token, $spotifyPlaylistId, $tid)) {
                $spotifyAdded = true;
            }
        }
    }
}

$conn->close();

$response = [
    "status" => $ok ? "success" : "error",
    "message" => $ok ? "Saved locally" : "Failed to save locally."
];
if (isset($isUserToken) && $isUserToken) {
    $response['message'] .= $spotifyAdded ? " And synced with Spotify." : " (Spotify sync skipped or no new tracks).";
}

echo json_encode($response);

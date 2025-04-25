<?php
// deleteFromPlaylist.php

// Allow CORS and get DB connection
require __DIR__ . '/headers.php';  // includes data_base.php for $conn

// Read and decode input
$input = json_decode(file_get_contents('php://input'), true);
$username     = $conn->real_escape_string($input['username'] ?? '');
$playlistName = trim($input['playlist']  ?? '');
$songToDel    = trim($input['song']      ?? '');
$artistToDel  = trim($input['artist']    ?? '');

// Validate
if (!$username || !$playlistName || !$songToDel || !$artistToDel) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Missing parameters']);
    exit();
}
$stmtCreds = $conn->prepare(
    "SELECT spotify_id, access_token FROM user_login_data WHERE username = ?"
);
$stmtCreds->bind_param("s", $username);
$stmtCreds->execute();
$creds = $stmtCreds->get_result()->fetch_assoc();
$spotifyId   = $creds['spotify_id']   ?? '';
$accessToken = $creds['access_token'] ?? '';

$stmt = $conn->prepare("SELECT playlists FROM user_playlists WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['status'=>'error','message'=>'User not found']);
    exit();
}

$row = $result->fetch_assoc();
$playlistsData = json_decode($row['playlists'], true) ?: [];

$found = false;
$trackIdToDel = '';
foreach ($playlistsData as &$pl) {
    if (isset($pl['name']) && $pl['name'] === $playlistName) {
        $newSongs = [];
        foreach ($pl['songs'] as $entry) {
            if ($entry['song'] === $songToDel && $entry['artist'] === $artistToDel) {
                $found = true;
                $trackIdToDel = $entry['trackId'] ?? '';
            } else {
                $newSongs[] = $entry;
            }
        }
        $pl['songs'] = $newSongs;
        break;
    }
}
unset($pl);

if (!$found) {
    http_response_code(404);
    echo json_encode(['status'=>'error','message'=>'Song not found in playlist']);
    exit();
}

if (!empty($spotifyId) && !empty($accessToken) && !empty($trackIdToDel)) {
    $plUrl = "https://api.spotify.com/v1/me/playlists?limit=50";
    $chPL = curl_init($plUrl);
    curl_setopt_array($chPL, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ["Authorization: Bearer {$accessToken}"]
    ]);
    $plResp = curl_exec($chPL);
    curl_close($chPL);
    $plList = json_decode($plResp, true);

    $spotifyPlaylistId = '';
    if (isset($plList['items'])) {
        foreach ($plList['items'] as $p) {
            if (strcasecmp($p['name'], $playlistName) === 0) {
                $spotifyPlaylistId = $p['id'];
                break;
            }
        }
    }

    if ($spotifyPlaylistId) {
        $delUrl = "https://api.spotify.com/v1/playlists/{$spotifyPlaylistId}/tracks";
        $body   = json_encode([ 'tracks' => [[ 'uri' => "spotify:track:{$trackIdToDel}" ]] ]);

        $chDel = curl_init($delUrl);
        curl_setopt_array($chDel, [
            CURLOPT_CUSTOMREQUEST => 'DELETE',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => [
                "Authorization: Bearer {$accessToken}",
                'Content-Type: application/json'
            ],
            CURLOPT_POSTFIELDS    => $body
        ]);
        $delResp = curl_exec($chDel);
        curl_close($chDel);

        $delData = json_decode($delResp, true);
        if (isset($delData['error'])) {
            error_log("Spotify delete error: " . $delData['error']['message']);
        }
    }
}

$updatedJson = json_encode($playlistsData, JSON_PRETTY_PRINT);
$updStmt = $conn->prepare("UPDATE user_playlists SET playlists = ? WHERE username = ?");
$updStmt->bind_param("ss", $updatedJson, $username);
if (!$updStmt->execute()) {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>'Failed to update playlist']);
    exit();
}

echo json_encode(['status'=>'success','message'=>'Song removed from playlist']);
exit();
?>

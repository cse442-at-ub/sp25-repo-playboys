<?php
// getUserPlaylists.php

require __DIR__ . '/data_base.php';
require __DIR__ . '/cookieAuthHeader.php';
header('Content-Type: application/json');

// Retrieve logged-in user
$userRow = $result->fetch_assoc();
$username = $userRow['username'] ?? null;
if (!$username) {
    echo json_encode([
        'status'  => 'error',
        'message' => 'Unable to determine logged‑in user'
    ]);
    exit();
}

// Check if user has a Spotify account
$hasSpotify    = false;
$spotifyUserId = '';
$accessToken   = '';
$stmt = $conn->prepare(
    "SELECT spotify_id, access_token
       FROM user_login_data
      WHERE username = ?"
);
$stmt->bind_param('s', $username);
$stmt->execute();
$loginRes = $stmt->get_result();
if ($loginRes && $loginRes->num_rows > 0) {
    $loginRow = $loginRes->fetch_assoc();
    if (!empty($loginRow['spotify_id']) && !empty($loginRow['access_token'])) {
        $hasSpotify    = true;
        $spotifyUserId = $loginRow['spotify_id'];
        $accessToken   = $loginRow['access_token'];
    }
}
$stmt->close();

$playlistsData = [];

if ($hasSpotify) {
    // Fetch playlists from Spotify
    $url = "https://api.spotify.com/v1/users/{$spotifyUserId}/playlists?limit=50";
    do {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => [
                "Authorization: Bearer {$accessToken}",
                "Content-Type: application/json"
            ],
        ]);
        $raw = curl_exec($ch);
        curl_close($ch);
        $data = json_decode($raw, true);
        if (empty($data['items']) || !is_array($data['items'])) {
            break;
        }
        foreach ($data['items'] as $pl) {
            $plName  = $pl['name'] ?? '';
            $plId    = $pl['id'] ?? '';
            $plImage = $pl['images'][0]['url'] ?? '';

            // Fetch tracks for this playlist
            $songs = [];
            $tracksUrl = "https://api.spotify.com/v1/playlists/{$plId}/tracks?fields=items(track(id,name,artists(name))),next&limit=100";
            do {
                $ch2 = curl_init($tracksUrl);
                curl_setopt_array($ch2, [
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_HTTPHEADER     => [
                        "Authorization: Bearer {$accessToken}",
                        "Content-Type: application/json"
                    ],
                ]);
                $raw2 = curl_exec($ch2);
                curl_close($ch2);
                $d2 = json_decode($raw2, true);
                if (empty($d2['items']) || !is_array($d2['items'])) {
                    break;
                }
                foreach ($d2['items'] as $item) {
                    $t = $item['track'] ?? [];
                    if (empty($t['id'])) continue;
                    $artistNames = [];
                    if (!empty($t['artists']) && is_array($t['artists'])) {
                        foreach ($t['artists'] as $ar) {
                            $artistNames[] = $ar['name'];
                        }
                    }
                    $songs[] = [
                        'song'    => $t['name'] ?? '',
                        'artist'  => implode(', ', $artistNames),
                        'trackId' => $t['id']
                    ];
                }
                $tracksUrl = !empty($d2['next']) ? $d2['next'] : null;
            } while ($tracksUrl);

            $playlistsData[] = [
                'name'  => $plName,
                'image' => $plImage,
                'songs' => $songs
            ];
        }
        $url = !empty($data['next']) ? $data['next'] : null;
    } while ($url);

    // Upsert into local DB
    $payloadJson = json_encode($playlistsData);
    $up = $conn->prepare(
        "INSERT INTO user_playlists (username, playlists)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE playlists = VALUES(playlists)"
    );
    $up->bind_param('ss', $username, $payloadJson);
    $up->execute();
    $up->close();
} else {
    // No Spotify; load from local DB
    $stmt2 = $conn->prepare(
        "SELECT playlists FROM user_playlists WHERE username = ? LIMIT 1"
    );
    $stmt2->bind_param('s', $username);
    $stmt2->execute();
    $res2 = $stmt2->get_result();
    if ($res2 && $res2->num_rows > 0) {
        $row2 = $res2->fetch_assoc();
        $decoded = json_decode($row2['playlists'] ?? '[]', true);
        $playlistsData = is_array($decoded) ? $decoded : [];
    }
    $stmt2->close();
}

// Prepare output: only names
$output = ['playlists' => []];
foreach ($playlistsData as $pl) {
    if (!empty($pl['name'])) {
        $output['playlists'][] = $pl['name'];
    }
}

echo json_encode($output);

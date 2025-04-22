<?php
// deleteFromPlaylist.php

// Allow CORS and get DB connection
require __DIR__ . '/headers.php';  // includes data_base.php for $conn :contentReference[oaicite:2]{index=2}&#8203;:contentReference[oaicite:3]{index=3}

// Read and decode input
$input = json_decode(file_get_contents('php://input'), true);
$username     = $conn->real_escape_string($input['username'] ?? '');
$playlistName = $input['playlist']  ?? '';
$songToDel    = $input['song']      ?? '';
$artistToDel  = $input['artist']    ?? '';

// Validate
if (!$username || !$playlistName || !$songToDel || !$artistToDel) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Missing parameters']);
    exit();
}

// Fetch current playlists JSON
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

// Find and update the target playlist
$found = false;
foreach ($playlistsData as &$pl) {
    if (isset($pl['name']) && $pl['name'] === $playlistName) {
        $newSongs = [];
        foreach ($pl['songs'] as $entry) {
            // Keep everything except the matching song/artist
            if (!($entry['song'] === $songToDel && $entry['artist'] === $artistToDel)) {
                $newSongs[] = $entry;
            } else {
                $found = true;
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

// Write updated JSON back to database
$updatedJson = json_encode($playlistsData, JSON_PRETTY_PRINT);
$updStmt = $conn->prepare("UPDATE user_playlists SET playlists = ? WHERE username = ?");
$updStmt->bind_param("ss", $updatedJson, $username);
if (!$updStmt->execute()) {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>'Failed to update playlist']);
    exit();
}

// Success
echo json_encode(['status'=>'success','message'=>'Song removed from playlist']);

<?php
// getUserPlaylists.php

require __DIR__ . '/cookieAuthHeader.php';

$userRow = $resultult->fetch_assoc();
$login_username = $userRow['username'] ?? null;

if (!$login_username) {
    echo json_encode([
        'status'  => 'error',
        'message' => 'Unable to determine logged‑in user'
    ]);
    exit();
}

$stmt = $conn->prepare(
    "SELECT playlists 
       FROM user_playlists 
      WHERE username = ? 
      LIMIT 1"
);
$stmt->bind_param("s", $login_username);
$stmt->execute();
$result = $stmt->get_result();

$output = ['playlists' => []];

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $rawJson = $row['playlists'] ?? '[]';

    $allPlaylists = json_decode($rawJson, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($allPlaylists)) {
        $names = [];
        foreach ($allPlaylists as $pl) {
            if (isset($pl['name'])) {
                $names[] = $pl['name'];
            }
        }
        $output['playlists'] = $names;
    }
}

echo json_encode($output);

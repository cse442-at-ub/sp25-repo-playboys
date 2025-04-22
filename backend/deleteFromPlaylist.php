<?php
// deleteFromPlaylist.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
require __DIR__ . '/headers.php';            // e.g. sets CORS & Content-Type
require __DIR__ . '/cookieAuthHeader.php';   // e.g. checks session/cookie auth
require __DIR__ . '/usernameGrabber.php';    // must define $username
require __DIR__ . '/userDatabaseGrabber.php';// must define $conn (mysqli)

// Read and decode JSON input
$input = json_decode(file_get_contents('php://input'), true);

$playlistName = $input['playlist'] ?? null;
$songToRemove  = $input['song']     ?? null;
$artistToRemove= $input['artist']   ?? null;

if (!$playlistName || !$songToRemove || !$artistToRemove) {
    http_response_code(400);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Missing required fields: playlist, song, and artist.'
    ]);
    exit;
}

// Fetch current playlists JSON for this user
$stmt = $conn->prepare("SELECT playlists FROM user_playlists WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($playlistsJson);

if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode([
        'status'  => 'error',
        'message' => 'User not found or no playlists stored.'
    ]);
    exit;
}
$stmt->close();

// Decode playlists into PHP array
$playlists = json_decode($playlistsJson, true);
if (!is_array($playlists)) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Corrupted playlists data.'
    ]);
    exit;
}

// Locate the right playlist and remove the song(s)
$foundPlaylist = false;
foreach ($playlists as &$pl) {
    if (isset($pl['name']) && $pl['name'] === $playlistName) {
        $foundPlaylist = true;
        $pl['songs'] = array_values(array_filter(
            $pl['songs'],
            function($s) use ($songToRemove, $artistToRemove) {
                return !(
                    isset($s['song'], $s['artist'])
                    && $s['song']   === $songToRemove
                    && $s['artist'] === $artistToRemove
                );
            }
        ));
        break;
    }
}
unset($pl);

if (!$foundPlaylist) {
    http_response_code(404);
    echo json_encode([
        'status'  => 'error',
        'message' => "Playlist \"$playlistName\" not found."
    ]);
    exit;
}

// update the DB
$newJson = json_encode($playlists);
$updates = $conn->prepare("UPDATE user_playlists SET playlists = ? WHERE username = ?");
$updates->bind_param("ss", $newJson, $username);

if ($updates->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Database update failed: '.$conn->error
    ]);
}

$updates->close();
$conn->close();

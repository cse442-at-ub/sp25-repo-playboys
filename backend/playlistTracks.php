<?php


require_once __DIR__ . "/headers.php";             
require_once __DIR__ . "/data_base.php";           
require_once __DIR__ . "/cookieAuthHeader.php";    

header('Content-Type: application/json');

if (!isset($_GET['username']) || !isset($_GET['playlist'])) {
    echo json_encode([
        "status"  => "error",
        "message" => "Missing parameters: username and playlist are required."
    ]);
    exit();
}

$requestedUser = $_GET['username'];
$playlistName  = $_GET['playlist'];

$loggedIn = $result->fetch_assoc()['username'];
$targetUser = ($requestedUser !== '' ? $requestedUser : $loggedIn);

$stmt = $conn->prepare(
    "SELECT spotify_id, access_token
       FROM user_login_data
      WHERE username = ?"
);
$stmt->bind_param("s", $targetUser);
$stmt->execute();
$creds = $stmt->get_result()->fetch_assoc();

if ($creds['spotify_id'] !== null) {
    $spotifyId   = $creds['spotify_id'];
    $accessToken = $creds['access_token'];

    $url = "https://api.spotify.com/v1/users/{$spotifyId}/playlists?limit=50";
    $ch  = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ["Authorization: Bearer {$accessToken}"]
    ]);
    $plResp = curl_exec($ch);
    curl_close($ch);

    $plData = json_decode($plResp, true);
    if (isset($plData['error'])) {
        echo json_encode([
            "status"  => "error",
            "message" => "Spotify API error fetching playlists."
        ]);
        exit();
    }

    
    $found = null;
    foreach ($plData['items'] as $p) {
        if (strcasecmp($p['name'], $playlistName) === 0) {
            $found = $p;
            break;
        }
    }
    if (!$found) {
        echo json_encode([
            "status"  => "error",
            "message" => "Playlist “{$playlistName}” not found on Spotify."
        ]);
        exit();
    }

    
    $tracksUrl = "https://api.spotify.com/v1/playlists/{$found['id']}/tracks?limit=100";
    $ch2       = curl_init($tracksUrl);
    curl_setopt_array($ch2, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ["Authorization: Bearer {$accessToken}"]
    ]);
    $tResp = curl_exec($ch2);
    curl_close($ch2);

    $tData = json_decode($tResp, true);
    if (isset($tData['error'])) {
        echo json_encode([
            "status"  => "error",
            "message" => "Spotify API error fetching tracks."
        ]);
        exit();
    }

    
    $songs = [];
    foreach ($tData['items'] as $item) {
        if (!empty($item['track'])) {
            $trk       = $item['track'];
            $artists   = array_map(fn($a) => $a['name'], $trk['artists']);
            $songs[]   = [
                "song"    => $trk['name'],
                "artist"  => implode(', ', $artists),
                "trackId" => $trk['id']
            ];
        }
    }

    echo json_encode([
        "status" => "success",
        "tracks" => $songs
    ]);
    exit();
}


$stmt = $conn->prepare("SELECT playlists FROM user_playlists WHERE username = ?");
$stmt->bind_param("s", $targetUser);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();

if (!$row || !$row['playlists']) {
    echo json_encode([
        "status"  => "error",
        "message" => "No local playlists found for user."
    ]);
    exit();
}

$playlistsArr = json_decode($row['playlists'], true);
if ($playlistsArr === null) {
    echo json_encode([
        "status"  => "error",
        "message" => "Error decoding playlists JSON."
    ]);
    exit();
}


$found = null;
foreach ($playlistsArr as $pl) {
    if (isset($pl['name']) && strcasecmp($pl['name'], $playlistName) === 0) {
        $found = $pl;
        break;
    }
}

if (!$found) {
    echo json_encode([
        "status"  => "error",
        "message" => "Playlist not found in local database."
    ]);
    exit();
}


echo json_encode([
    "status" => "success",
    "tracks" => ($found['songs'] ?? [])
]);
exit();
?>

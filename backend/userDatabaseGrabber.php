<?php
//will store function that'll grab any users data from sql table 

function checkFriendStatus($conn, $username, $friend) {
    try {
        $stmt = $conn->prepare("
            SELECT status, requester 
            FROM friend_pairs 
            WHERE (username = ? AND friend = ?) 
               OR (username = ? AND friend = ?)
        ");
        $stmt->bind_param("ssss", $username, $friend, $friend, $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            return [
                "status" => $row['status'],
                "requester" => $row['requester']
                ];;
        }
        return ["status" => "none",
        "requester" => "none"
        ];;;
    } catch (Exception $e) {
        return "Error: " . $e->getMessage();
    }
}

function deleteFriend($conn, $username, $friend){
    try {
        $stmt = $conn->prepare("
            DELETE FROM friend_pairs
            WHERE (username = ? AND friend = ?) 
               OR (username = ? AND friend = ?)
        ");
        $stmt->bind_param("ssss", $username, $friend, $friend, $username);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            return 1; // Deletion successful
        } else {
            return 0; // No rows affected, meaning no friendship existed
        }
    } catch (Exception $e) {
        return false; // Handle errors if needed
    }
}
function grabAllFriendRequest($conn, $username) {
    $requesters = [];
    try {
        $status = "pending";
        $stmt = $conn->prepare("SELECT * FROM friend_pairs WHERE (username = ? OR friend = ?) AND status = ? AND requester <> ?");
        $stmt->bind_param("ssss", $username, $username, $status, $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $requesters = [];
        while ($row = $result->fetch_assoc()) {
            $requesters[] = $row['requester']; // Add requester to the array
        }
        return ["pending_requests" => $requesters]; 
    } catch (Exception $e) {
        return "Error: " . $e->getMessage();
    }
}

function isValidEmail($email){
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    if(filter_var($email, FILTER_VALIDATE_EMAIL)){
        list($user, $domain) = explode('@', $email);
        if(checkdnsrr($domain, 'MX') || checkdnsrr($domain, 'A')){ //checks for MX or A records
            return true;
        }
    }
    return false;
}

function grabAllFriends($conn, $username) {
    $friends = [];
    $status = "friends";
    $stmt = $conn->prepare("SELECT * FROM friend_pairs WHERE (username = ? OR friend = ?) AND status = ?");
    $stmt->bind_param("sss", $username, $username, $status);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result ->fetch_assoc()){
        //if the login username is placed in username sql column, their friend will be at the friend column
        if($row["username"] == $username){
            $friend = $row["friend"];
            if(!in_array($friend,$friends)){
                $friends[] = $friend;
            }
        
    //if the login username is placed in friend sql column, their friend will be at the username column
        }else if($row["friend"] == $username){
            $friend = $row["username"];
            if(!in_array($friend, $friends)){
                $friends[] = $friend;
            }
        }

    }
    return $friends;
}


function checkUserinEvents($conn, $userame, $id){
    $stmt = $conn->prepare("SELECT * FROM event_participants WHERE username = ? AND id = ?");
    $stmt->bind_param("ss", $userame, $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        return true; // User is in the event
    } else {
        return false; // User is not in the event
    }

}

function grabAllEventParticipants($conn, $id){
    $stmt = $conn->prepare("SELECT * FROM event_participants WHERE id = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $participants = [];
    while ($row = $result ->fetch_assoc()){
        $profile_stmt = $conn-> prepare("SELECT profile_pic FROM user_profiles WHERE username = ?");
        $profile_stmt->bind_param("s", $row["username"]);
        $profile_stmt->execute();
        $image_result = $profile_stmt->get_result();
        $image_result = $image_result->fetch_assoc();
        $parpticipant = ["image" => $image_result["profile_pic"] ?? "", "username" => $row["username"]];
        $participants[] = $parpticipant;
    }
    return $participants;
}

function convertTo12Hour($time24) {
    $timestamp = strtotime($time24);
    return date("g:i A", $timestamp);
}

function convertToShortDate($date) {
    $timestamp = strtotime($date);
    return date("M j", $timestamp);
}

function formatDateToMDY($dateString) {
    return date("m/d/Y", strtotime($dateString));
}


//grab event creator by using event_id. return null if none found
function eventCreatorFetch($conn, $id){
    $name = "";
    $event_stmt = $conn->prepare("SELECT creator FROM artist_events WHERE id = ?");
    $event_stmt->bind_param("s", $id);
    $event_stmt->execute();
    $event = $event_stmt->get_result();
    
    if($event->num_rows <= 0){
        return $name = null;
    }
    $event = $event->fetch_assoc();
    $name = $event["creator"];
    return $name;
}

function date_checker($date){
    date_default_timezone_set('America/New_York');
    $now = new DateTime();
    $currentDate = $now->format('Y-m-d');

    if ($date < $currentDate ) {
        return false; // Event date and time are in the past
    }
    return true; // Event date and time are valid

}

function fulldatatime_checker($date, $time){
    date_default_timezone_set('America/New_York');
    
    // Combine date and time into a single string
    $datetime = $date . " " . $time;
    
    // Create a DateTime object from the input datetime string
    $eventDateTime = DateTime::createFromFormat('Y-m-d H:i', $datetime);
    
    if ($eventDateTime === false) {
        // Invalid datetime format
        return false;
    }

    // Get the current datetime in the same format
    $now = new DateTime();
    
    // Compare the event datetime with the current datetime
    if ($eventDateTime < $now) {
        return false; // Event time is in the past
    }
    
    return true; // Event time is valid
}


function deleteEvent($conn, $id){
    $delete_stmt = $conn->prepare("
    DELETE FROM artist_events 
    WHERE id = ?
    ");
    $delete_stmt->bind_param("s", $id);
    $delete_stmt->execute();

    //delete all participants in events
    $delete_participants = $conn->prepare ("
    DELETE FROM event_participants WHERE id = ?
    ");
    $delete_participants->bind_param("s", $id);
    $delete_participants->execute();
}

//check if user_playlist row exist for user, if not create one for them 
function user_playlist_checker($conn, $username){
    try {
            $stmt = $conn->prepare("
            SELECT * FROM user_playlists WHERE username = ?
        ");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows <= 0){
            // Create a new row for the user with an empty playlist
            $stmt = $conn->prepare("
                INSERT INTO user_playlists (username, playlists) VALUES (?, '[]')
            ");
            $stmt->bind_param("s", $username);
            $stmt->execute();
        }
    } catch (Exception $e) {
        return "failed";
    }
    return "success";
}

//create Playlist
function createPlaylist($conn, $playlist_name, $username) {
    // grab already existing playlists
    $stmt = $conn->prepare("
        SELECT playlists 
          FROM user_playlists 
         WHERE username = ?
    ");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows < 0) {
        return "failed";
    }
    $row = $result->fetch_assoc();
    $playlistsData = json_decode($row['playlists'], true) ?: [];

    // Check if the playlist already exists
    foreach ($playlistsData as $playlist) {
        if (isset($playlist['name']) && $playlist['name'] === $playlist_name) {
            return "exists";
        }
    }

    // Create a new playlist locally
    $newPlaylist = [
        "name"  => $playlist_name,
        "image" => "https://cdn.dribbble.com/userupload/20851422/file/original-b82fd38c350d47a4f8f4e689f609993a.png?resize=752x&vertical=center",
        "songs" => [],
    ];
    $playlistsData[] = $newPlaylist;
    $jsonData = json_encode($playlistsData, JSON_PRETTY_PRINT);

    // Write back to local DB
    $upd = $conn->prepare("
        UPDATE user_playlists 
           SET playlists = ? 
         WHERE username = ?
    ");
    $upd->bind_param("ss", $jsonData, $username);
    $upd->execute();

    // ——— Sync to Spotify ———
    $userStmt = $conn->prepare("
        SELECT spotify_id, access_token 
          FROM user_login_data 
         WHERE username = ?
    ");
    $userStmt->bind_param("s", $username);
    $userStmt->execute();
    $loginResult = $userStmt->get_result();
    if ($loginResult && $loginResult->num_rows > 0) {
        $u = $loginResult->fetch_assoc();
        $spotifyUserId   = $u['spotify_id']   ?? '';
        $spotifyToken    = $u['access_token'] ?? '';
        if ($spotifyUserId && $spotifyToken) {
            // if it doesn't already exist on Spotify, create it
            $spId = getSpotifyPlaylistId($spotifyToken, $spotifyUserId, $playlist_name);
            if (!$spId) {
                createSpotifyPlaylist($spotifyToken, $spotifyUserId, $playlist_name);
            }
        }
    }
    $userStmt->close();

    return "success";
}

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

?>



<?php
    require __DIR__ . "/../headers.php";
    require __DIR__ . "/../cookieAuthHeader.php";
    require __DIR__ . "/../userDatabaseGrabber.php";
    $user = $result->fetch_assoc();
    $login_username = $user["username"];
    $new_playlist_name = $_GET["name"];
    if (empty($new_playlist_name)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Playlist name cannot be empty'
        ]);
        exit();
    }
    if (strlen($new_playlist_name) > 15) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Playlist name must be less than 15 characters'
        ]);
        exit();
    }
    if (createPlaylist($conn, $new_playlist_name, $login_username) == "success") {
        echo json_encode([
            'status' => 'success',
            'message' => 'Playlist created successfully'
        ]);
    } 
    else if(createPlaylist($conn, $new_playlist_name, $login_username) == "exists") {
        echo json_encode([
            'status' => 'error',
            'message' => 'Playlist already exists'
        ]);
    }
    else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to create playlist'
        ]);
    }

?>
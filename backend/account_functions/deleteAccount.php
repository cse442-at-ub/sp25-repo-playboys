<?php

require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";
require __DIR__ . "/../communities_functions/community_db.php";

// get the data from the request
$data = json_decode(file_get_contents("php://input"), true);
$username = $data["username"] ?? null;
$email = $data["email"] ?? null;
$password = $data["password"] ?? null;

if (!$username || !$email || !$password) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

$storedHash = $result->fetch_assoc()["password"] ?? null;

if (!$storedHash) {
    echo json_encode(["status" => "error", "message" => "Username not found."]);
    exit;
}

if (password_verify($password, $storedHash)) {
    // Delete from user_login_data
    $stmt1 = $conn->prepare("DELETE FROM user_login_data WHERE username = ?");
    $stmt1->bind_param("s", $username);
    $stmt1->execute();
    
    // Delete from user_profiles
    $stmt2 = $conn->prepare("DELETE FROM user_profiles WHERE username = ?");
    $stmt2->bind_param("s", $username);
    $stmt2->execute();
    
    // Delete all likes by the user
    $stmt3 = $conn->prepare("DELETE FROM post_likes WHERE username = ?");
    $stmt3->bind_param("s", $username);
    $stmt3->execute();

    // Delete all comments by the user
    $stmt3 = $conn->prepare("DELETE FROM post_comments WHERE username = ?");
    $stmt3->bind_param("s", $username);
    $stmt3->execute();

    // Delete all posts by the user
    $stmt3 = $conn->prepare("DELETE FROM post_comments WHERE username = ?");
    $stmt3->bind_param("s", $username);
    $stmt3->execute();

    $friends = [];

    // Get all rows where the user is involved in a friendship
    $stmt = $conn->prepare("SELECT username, friend FROM friend_pairs WHERE (username = ? OR friend = ?) AND status = 'friends'");
    $stmt->bind_param("ss", $username, $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    // add friends to the array
    while ($row = $result->fetch_assoc()) {
        $friendUsername = ($row['username'] === $username) ? $row['friend'] : $row['username'];
        $friends[] = $friendUsername;
    }
    // decrement friend count for all friends of the deleted user
    foreach ($friends as $friend) {
        $stmt = $conn->prepare("UPDATE user_profiles SET friends = friends - 1 WHERE username = ?");
        $stmt->bind_param("s", $friend);
        $stmt->execute();
    }
    // delete all friend pairs
    $stmt = $conn->prepare("DELETE FROM friend_pairs WHERE username = ? OR friend = ?");
    $stmt->bind_param("ss", $username, $username);
    $stmt->execute();


    // Delete user from events
    $stmt5 = $conn->prepare("DELETE FROM event_participants WHERE username = ?");
    $stmt5->bind_param("s", $username);
    $stmt5->execute();

    // Delete Cookies
    $stmt6 = $conn->prepare("DELETE FROM cookie_authentication WHERE username = ?");
    $stmt6->bind_param("s", $username);
    $stmt6->execute();

    // Delete all posts by the user
    $stmt7 = $conn->prepare("DELETE FROM posts WHERE username = ?");
    $stmt7->bind_param("s", $username);
    $stmt7->execute();

    // Delete all playlists by the user
    $stmt8 = $conn->prepare("DELETE FROM user_playlists WHERE username = ?");
    $stmt8->bind_param("s", $username);
    $stmt8->execute();

    //Delete the user from all communities
    removeUserFromAllCommunities($conn, $username);





    if ($stmt1->affected_rows > 0 || $stmt2->affected_rows > 0) {
        echo json_encode(["status" => "success", "message" => "Account deleted successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete account."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Incorrect password."]);
}
?>

<?php
    require __DIR__ . "/headers.php";
    require __DIR__ . "/cookieAuthHeader.php";
    require __DIR__ . "/userDatabaseGrabber.php";

    $user = $result->fetch_assoc();
    $username = $user["username"];

    $friend_list = grabAllFriendRequest($conn, $username);
    echo json_encode(["status" => "success", "pendingFriends" => $friend_list["pending_requests"]]);
    exit();

?>
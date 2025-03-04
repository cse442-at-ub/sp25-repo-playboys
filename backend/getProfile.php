<?php
// Allow requests from any origin and check if user is logged in
require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuthHeader.php";
require __DIR__ . "/userDatabaseGrabber.php";

//check if the request method is a get request
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit();
}


try{
    //$result is from cookieAuth.php and is the username of the user
    $user = $result->fetch_assoc();
    $login_username = $user["username"];

    $username = $_GET['user'] ?? $login_username; 
    if($username == ""){
        $username = $login_username;
    }
    $stmt = $conn->prepare("SELECT username, email, friends, followers, followings, top_songs, top_artists, recent_activity FROM user_profiles WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $profile = $result->fetch_assoc();
        if($login_username == $username){
            echo json_encode(["status" => "success", "profile" => $profile, "loggedInUser" => $login_username, "isFriend" => "none"]);
        } else {
            $friend_checker = checkFriendStatus($conn, $login_username, $username);
            echo json_encode(["status" => "success", "profile" => $profile, "loggedInUser" => $login_username, "friendStatus" => $friend_checker["status"]]);
            exit();
        }
        
    } else {
        echo json_encode(["status" => "error", "message" => "No profile found, Please Login", "User" => $username]);
        exit();
    } 
}catch(Exception $e){
    echo json_encode(["status" => "error", "message" => "No profile found, Please Login", "User" => $username]);
    exit();
}

$stmt->close();
$conn->close();


?>
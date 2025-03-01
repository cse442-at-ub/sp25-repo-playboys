<?php
require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuth.php";
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit();
}


try{
    //$result is from cookieAuth.php and is the username of the user
    $user = $result->fetch_assoc();
    $username = $user["username"];
    $stmt = $conn->prepare("SELECT username, email, friends, followers, followings, top_songs, top_artists, recent_activity FROM user_profiles WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {

        $profile = $result->fetch_assoc();
        echo json_encode(["status" => "success", "profile" => $profile]);
        exit();
    } else {
        echo json_encode(["status" => "error", "message" => "No profile found, Please Login"]);
        exit();
    } 
}catch(Exception $e){
    echo json_encode(["status" => "error", "message" => "No profile found, Please Login"]);
    exit();
}

$stmt->close();
$conn->close();


?>
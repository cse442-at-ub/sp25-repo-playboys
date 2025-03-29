<?php
include __DIR__ . "/headers.php";
include __DIR__ . "/cookieAuthHeader.php"; // If you need authentication
include __DIR__ . "/userDatabaseGrabber.php";
$user = $result->fetch_assoc();
$data = [];
$counter = 0;
$login_username = $user["username"];

if(!isset($headers["page-source"])){
    echo "Error, no page-source header";
} 
$page = $headers["page-source"];

//load max 8 friends 

$friendlist = grabAllFriends($conn, $login_username);
if(empty($friendlist)){
    echo json_encode(["error", "empty friend list"]);
}
foreach ($friendlist as $friend){
        $friend_info = [];
        $stmt = $conn->prepare("SELECT profile_pic FROM user_profiles WHERE username = ?");
        $stmt->bind_param("s", $friend);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $profile = $result->fetch_assoc();
            $friend_info["name"] = $friend;
            $friend_info["image"] = $profile["profile_pic"];
            $data[] = $friend_info;
        }
    $counter++;
    if($page == "sidebar" && $counter >= 6){
        echo json_encode($data);
        exit();
    }
}
echo json_encode($data);
exit();
   
//load all friends 



?>
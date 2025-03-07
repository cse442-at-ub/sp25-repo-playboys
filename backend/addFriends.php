<?php
    require __DIR__ . "/headers.php";
    require __DIR__ . "/cookieAuthHeader.php";
    require __DIR__ . "/userDatabaseGrabber.php";
    //used to send friend request
    //check if the request method is a post request
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(["status" => "error", "message" => "Invalid request method"]);
        exit();
    }
    $data = json_decode(file_get_contents("php://input"), true); // decode JSON body
    try{
        $user = $result->fetch_assoc();
        $login_username = $user["username"];
        $potential_friend = trim($data["potential_friend"]);
        $friender_checker = checkFriendStatus($conn, $login_username, $potential_friend);
        if($friender_checker["status"] == "none"){
            $status = "pending";
            $stmt = $conn->prepare("INSERT INTO friend_pairs (username, friend, status, requester) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $login_username, $potential_friend, $status, $login_username);
            $stmt->execute();
            $stmt->close();
            echo json_encode(["status" => "success", "message" => "Friend request sent."]);
            exit();
        } else if($friender_checker["status"] == "pending" && $friender_checker["requester"] == $login_username){
            $stmt = $conn->prepare("DELETE FROM friend_pairs WHERE 
            (username = ? AND friend = ? AND requester = ?) 
            OR (username = ? AND friend = ? AND requester = ?)"); 
            $stmt->bind_param("ssssss", $login_username, $potential_friend, $login_username, $potential_friend, $login_username, $potential_friend);    
            $stmt->execute();
            $stmt->close();
            echo json_encode(["status" => "retract", "message" => "Friend request retracted."]);
            exit();
        }else{
            echo json_encode(["status" => "friends", "message" => "Already friends."]);
            exit();
        }
    }catch(Exception $e){
        echo json_encode(["status" => "error", "message" => "Failed to send friend request."]);
        exit();
    }
    $conn->close();
    exit();
?>

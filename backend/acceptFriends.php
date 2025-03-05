<?php
    require __DIR__ . "/headers.php";
    require __DIR__ . "/cookieAuthHeader.php";
    require __DIR__ . "/userDatabaseGrabber.php";
    $user = $result->fetch_assoc();
    $username = $user["username"];
    $data = json_decode(file_get_contents("php://input"), true);
    $friend = $data["friend"];
    $friend_checker = checkFriendStatus($conn, $username, $friend);
    if($friend_checker["status"] == "friends"){
        echo json_encode(["status" => "success", "message" => "Already Friends"]);
        exit();
    }
    //will change status to friends
   
    try{
        $stmt = $conn->prepare("
        UPDATE friend_pairs 
        SET status = ? 
        WHERE (username = ? AND friend = ?) 
            OR (username = ? AND friend = ?)
        ");

        // update status to friends
        $newStatus = "friends";
        
        $stmt->bind_param("sssss", $newStatus, $username, $friend, $friend, $username);
        $stmt->execute();
        
        //update friends counter
        // update profile stats to reflect the newly added friend
        //$stmt = $conn->prepare("SELECT email FROM user_profiles WHERE username = ?");
        // Retrieve friends count for the logged-in user
        $stmt = $conn->prepare("SELECT friends FROM user_profiles WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $temp_1 = $result->fetch_assoc();
        $temp_1 = isset($temp_1["friends"]) ? (int)$temp_1["friends"] : 0; // Ensure it's an integer
        $temp_1 += 1;

        // Update friends count for the logged-in user
        $stmt = $conn->prepare("UPDATE user_profiles SET friends = ? WHERE username = ?");
        $stmt->bind_param("is", $temp_1, $username);
        $stmt->execute();

        // Retrieve friends count for the friend
        $stmt = $conn->prepare("SELECT friends FROM user_profiles WHERE username = ?");
        $stmt->bind_param("s", $friend);
        $stmt->execute();
        $result = $stmt->get_result();
        $temp_2 = $result->fetch_assoc();
        $temp_2 = isset($temp_2["friends"]) ? (int)$temp_2["friends"] : 0; // Ensure it's an integer
        $temp_2 += 1;

        // Update friends count for the friend
        $stmt = $conn->prepare("UPDATE user_profiles SET friends = ? WHERE username = ?");
        $stmt->bind_param("is", $temp_2, $friend);
        $stmt->execute();
        echo json_encode(["status" => "success", "message" => " updated requester"]);
        exit();
    
    } 
    catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Failed to update requester"]);
        exit();
    }
    

?>
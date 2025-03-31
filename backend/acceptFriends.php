<?php
//used to accept and decline friend requests
    require __DIR__ . "/headers.php";
    require __DIR__ . "/cookieAuthHeader.php";
    require __DIR__ . "/userDatabaseGrabber.php";
    $user = $result->fetch_assoc();
    $username = $user["username"];
    $data = json_decode(file_get_contents("php://input"), true);
    $friend = $data["friend"];
    $choice = $data["choice"];
    $friend_checker = checkFriendStatus($conn, $username, $friend);
    if($friend_checker["status"] == "friends"){
        echo json_encode(["status" => "success", "message" => "Already Friends"]);
        exit();
    }
    //will change status to friends
   
    try{
        //decline friend request
        if($choice === "declined"){
            $stmt = $conn->prepare("DELETE FROM friend_pairs WHERE (username = ? AND requester = ?) OR (friend = ? AND requester = ?)");
            $stmt->bind_param("ssss", $username, $friend, $username, $friend);
            $stmt->execute();
            $stmt->execute();
            echo json_encode(["status" => "success", "message" => " updated requester"]);
            exit();
        }

        $stmt = $conn->prepare("
        UPDATE friend_pairs 
        SET status = ? 
        WHERE (username = ? AND friend = ?) 
            OR (username = ? AND friend = ?)
        ");


        // friend request status


        //check if friend request still exist
        $status = checkFriendStatus($conn, $username, $friend);
        if($status["status"] == "none"){
            echo json_encode(["status" => "success", "message" => "friend request disappeared"]);
            exit();
        }
        
        //removing friend
        if($status["status"] == "friends"){
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
            $temp_1 -= 1;

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
            $temp_2 -= 1;

            // Update friends count for the friend
            $stmt = $conn->prepare("UPDATE user_profiles SET friends = ? WHERE username = ?");
            $stmt->bind_param("is", $temp_2, $friend);
            $stmt->execute();
            $delete = deleteFriend($conn, $username, $friend);
            echo json_encode(["status" => "success", "message" => " updated requester"]);
            exit();
        }

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
        echo json_encode(["status" => "error", "message" => $e]);
        exit();
    }
    

?>
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
        $requested_status = $data["status"];
        $friender_checker = checkFriendStatus($conn, $login_username, $potential_friend);
        if($friender_checker["status"] == "none" && $requested_status == "add"){
            $status = "pending";
            $stmt = $conn->prepare("INSERT INTO friend_pairs (username, friend, status, requester) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $login_username, $potential_friend, $status, $login_username);
            $stmt->execute();
            $stmt->close();
            echo json_encode(["status" => "success", "message" => "Friend request sent."]);
            exit();
        } else if($friender_checker["status"] == "pending" && $friender_checker["requester"] == $login_username && $requested_status == "pending"){
            $stmt = $conn->prepare("DELETE FROM friend_pairs WHERE 
            (username = ? AND friend = ? AND requester = ?) 
            OR (username = ? AND friend = ? AND requester = ?)"); 
            $stmt->bind_param("ssssss", $login_username, $potential_friend, $login_username, $potential_friend, $login_username, $potential_friend);    
            $stmt->execute();
            $stmt->close();
            echo json_encode(["status" => "retract", "message" => "Friend request retracted."]);
            exit();
        }else if($friender_checker["status"] == "pending" && $friender_checker["requester"] != $login_username && $requested_status == "pending"){
            echo json_encode(["status" => "success", "message" => "Friend request sent."]);
            exit();
        }else if(($friender_checker["status"] == "friends" || $friender_checker["status"] == "none") && ($requested_status == "unfriend" || $requested_status == "other unfriend")){
            //update friends counter
            // update profile stats to reflect the newly added friend
            //$stmt = $conn->prepare("SELECT email FROM user_profiles WHERE username = ?");
            // Retrieve friends count for the logged-in user

            if($friender_checker["status"] == "friends"){
                $stmt = $conn->prepare("SELECT friends FROM user_profiles WHERE username = ?");
                $stmt->bind_param("s", $login_username);
                $stmt->execute();
                $result = $stmt->get_result();
                $temp_1 = $result->fetch_assoc();
                $temp_1 = isset($temp_1["friends"]) ? (int)$temp_1["friends"] : 0; // Ensure it's an integer
                $temp_1 -= 1;
    
                // Update friends count for the logged-in user
                $stmt = $conn->prepare("UPDATE user_profiles SET friends = ? WHERE username = ?");
                $stmt->bind_param("is", $temp_1, $login_username);
                $stmt->execute();
    
                // Retrieve friends count for the friend
                $stmt = $conn->prepare("SELECT friends FROM user_profiles WHERE username = ?");
                $stmt->bind_param("s", $potential_friend);
                $stmt->execute();
                $result = $stmt->get_result();
                $temp_2 = $result->fetch_assoc();
                $temp_2 = isset($temp_2["friends"]) ? (int)$temp_2["friends"] : 0; // Ensure it's an integer
                $temp_2 -= 1;

            }


            // Update friends count for the friend
            $stmt = $conn->prepare("UPDATE user_profiles SET friends = ? WHERE username = ?");
            $stmt->bind_param("is", $temp_2, $potential_friend);
            $stmt->execute();
            $delete = deleteFriend($conn, $login_username, $potential_friend);
            if($requested_status == "unfriend"){
                echo json_encode(["status" => "removed", "message" => "removed friend"]);
            }else{
                echo json_encode(["status" => "other removed", "message" => "removed friend"]);
            }
            exit();
           
        }else{
            echo json_encode(["status" => "friends", "message" => "Already friends."]);
        }
    }catch(Exception $e){
        echo json_encode(["status" => "error", "message" => "Failed to send friend request."]);
        exit();
    }
    $conn->close();
    exit();
?>

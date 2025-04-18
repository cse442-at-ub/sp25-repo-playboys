<?php
//will store function that'll grab any users data from sql table 

function checkFriendStatus($conn, $username, $friend) {
    try {
        $stmt = $conn->prepare("
            SELECT status, requester 
            FROM friend_pairs 
            WHERE (username = ? AND friend = ?) 
               OR (username = ? AND friend = ?)
        ");
        $stmt->bind_param("ssss", $username, $friend, $friend, $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            return [
                "status" => $row['status'],
                "requester" => $row['requester']
                ];;
        }
        return ["status" => "none",
        "requester" => "none"
        ];;;
    } catch (Exception $e) {
        return "Error: " . $e->getMessage();
    }
}

function deleteFriend($conn, $username, $friend){
    try {
        $stmt = $conn->prepare("
            DELETE FROM friend_pairs
            WHERE (username = ? AND friend = ?) 
               OR (username = ? AND friend = ?)
        ");
        $stmt->bind_param("ssss", $username, $friend, $friend, $username);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            return 1; // Deletion successful
        } else {
            return 0; // No rows affected, meaning no friendship existed
        }
    } catch (Exception $e) {
        return false; // Handle errors if needed
    }
}
function grabAllFriendRequest($conn, $username) {
    $requesters = [];
    try {
        $status = "pending";
        $stmt = $conn->prepare("SELECT * FROM friend_pairs WHERE (username = ? OR friend = ?) AND status = ? AND requester <> ?");
        $stmt->bind_param("ssss", $username, $username, $status, $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $requesters = [];
        while ($row = $result->fetch_assoc()) {
            $requesters[] = $row['requester']; // Add requester to the array
        }
        return ["pending_requests" => $requesters]; 
    } catch (Exception $e) {
        return "Error: " . $e->getMessage();
    }
}

function isValidEmail($email){
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    if(filter_var($email, FILTER_VALIDATE_EMAIL)){
        list($user, $domain) = explode('@', $email);
        if(checkdnsrr($domain, 'MX') || checkdnsrr($domain, 'A')){ //checks for MX or A records
            return true;
        }
    }
    return false;
}

function grabAllFriends($conn, $username) {
    $friends = [];
    $status = "friends";
    $stmt = $conn->prepare("SELECT * FROM friend_pairs WHERE (username = ? OR friend = ?) AND status = ?");
    $stmt->bind_param("sss", $username, $username, $status);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result ->fetch_assoc()){
        //if the login username is placed in username sql column, their friend will be at the friend column
        if($row["username"] == $username){
            $friend = $row["friend"];
            if(!in_array($friend,$friends)){
                $friends[] = $friend;
            }
        
    //if the login username is placed in friend sql column, their friend will be at the username column
        }else if($row["friend"] == $username){
            $friend = $row["username"];
            if(!in_array($friend, $friends)){
                $friends[] = $friend;
            }
        }

    }
    return $friends;
}


function checkUserinEvents($conn, $userame, $id){
    $stmt = $conn->prepare("SELECT * FROM event_participants WHERE username = ? AND id = ?");
    $stmt->bind_param("ss", $userame, $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        return true; // User is in the event
    } else {
        return false; // User is not in the event
    }

}

function grabAllEventParticipants($conn, $id){
    $stmt = $conn->prepare("SELECT * FROM event_participants WHERE id = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $participants = [];
    while ($row = $result ->fetch_assoc()){
        $profile_stmt = $conn-> prepare("SELECT profile_pic FROM user_profiles WHERE username = ?");
        $profile_stmt->bind_param("s", $row["username"]);
        $profile_stmt->execute();
        $image_result = $profile_stmt->get_result();
        $image_result = $image_result->fetch_assoc();
        $parpticipant = ["image" => $image_result["profile_pic"] ?? "", "username" => $row["username"]];
        $participants[] = $parpticipant;
    }
    return $participants;
}

function convertTo12Hour($time24) {
    $timestamp = strtotime($time24);
    return date("g:i A", $timestamp);
}

function convertToShortDate($date) {
    $timestamp = strtotime($date);
    return date("M j", $timestamp);
}

function formatDateToMDY($dateString) {
    return date("m/d/Y", strtotime($dateString));
}


//grab event creator by using event_id. return null if none found
function eventCreatorFetch($conn, $id){
    $name = "";
    $event_stmt = $conn->prepare("SELECT creator FROM artist_events WHERE id = ?");
    $event_stmt->bind_param("s", $id);
    $event_stmt->execute();
    $event = $event_stmt->get_result();
    
    if($event->num_rows <= 0){
        return $name = null;
    }
    $event = $event->fetch_assoc();
    $name = $event["creator"];
    return $name;
}

function date_checker($date){
    date_default_timezone_set('America/New_York');
    $now = new DateTime();
    $currentDate = $now->format('Y-m-d');

    if ($date < $currentDate ) {
        return false; // Event date and time are in the past
    }
    return true; // Event date and time are valid

}

function fulldatatime_checker($date, $time){
    date_default_timezone_set('America/New_York');
    
    // Combine date and time into a single string
    $datetime = $date . " " . $time;
    
    // Create a DateTime object from the input datetime string
    $eventDateTime = DateTime::createFromFormat('Y-m-d H:i', $datetime);
    
    if ($eventDateTime === false) {
        // Invalid datetime format
        return false;
    }

    // Get the current datetime in the same format
    $now = new DateTime();
    
    // Compare the event datetime with the current datetime
    if ($eventDateTime < $now) {
        return false; // Event time is in the past
    }
    
    return true; // Event time is valid
}


function deleteEvent($conn, $id){
    $delete_stmt = $conn->prepare("
    DELETE FROM artist_events 
    WHERE id = ?
    ");
    $delete_stmt->bind_param("s", $id);
    $delete_stmt->execute();

    //delete all participants in events
    $delete_participants = $conn->prepare ("
    DELETE FROM event_participants WHERE id = ?
    ");
    $delete_participants->bind_param("s", $id);
    $delete_participants->execute();
}
?>





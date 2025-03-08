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
?>
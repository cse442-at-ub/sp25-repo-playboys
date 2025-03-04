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
?>
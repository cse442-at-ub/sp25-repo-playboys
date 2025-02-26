<?php

include "data_base.php";

function updateProfile($conn, $data) {
    // Get the user ID from the request (default to 1 if not provided)
    $user_id = isset($data['id']) ? intval($data['id']) : 1;

    // Fetch user profile details
    $sql = "SELECT username, email, profile_pic, friends_count, followers_count, following_count FROM users WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if a user was found
    if ($result->num_rows > 0) {
        // Return user data as JSON
        echo json_encode($result->fetch_assoc());
    } else {
        // Return an error if user not found
        echo json_encode(["error" => "User not found"]);
    }

    // Close the statement and database connection
    $stmt->close();
    $conn->close();
}


?>

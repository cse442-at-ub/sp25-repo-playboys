<?php
header('Content-Type: application/json');




// Get username from query string
if (!isset($_GET['username']) || empty($_GET['username'])) {
    echo json_encode(["error" => "Username is required"]);
    exit;
}

$username = $conn->real_escape_string($_GET['username']); // Prevent SQL Injection

// Query to fetch user details
$sql = "SELECT `email`, `profile_pic`, `friends_count`, `followers_count`, `following_count` 
        FROM `users` 
        WHERE `username` = '$username'"; 
$result = $conn->query($sql);

// Check if results exist
if ($result->num_rows > 0) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} else {
    echo json_encode(["message" => "No data found"]);
}

// Close connection
$conn->close();
?>

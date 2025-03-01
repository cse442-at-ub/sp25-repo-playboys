<?php
require __DIR__ . "/headers.php";

if (isset($_GET['username'])) {
    $username = $_GET['username'];

    // Fetch user profile based on username
    $stmt = $conn->prepare("SELECT username, email, friends, followers, following, top_songs, top_artists, recent_activity FROM user_profiles WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $profile = $result->fetch_assoc();
        echo json_encode(["status" => "success", "profile" => $profile], JSON_PRETTY_PRINT);
    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "No username provided"]);
    echo json_encode(["status" => "error", "message" => "No username provided"]);
}

$conn->close();
?>
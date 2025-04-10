<?php
// getPosts.php
require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuthHeader.php"; // If you need authentication

header('Content-Type: application/json');

try {
    $stmt = $conn->prepare("SELECT * FROM posts ORDER BY created_at DESC");
    $stmt->execute();
    $result = $stmt->get_result();
    
    $posts = array();
    
    while ($row = $result->fetch_assoc()) {
        $posts[] = array(
            "post_id" => $row['post_id'],
            "username" => $row['username'],
            "title" => $row['title'], // Added title which was in your table schema
            "description" => $row['description'],
            "song_name" => $row['song_name'],
            "media_path" => $row['media_path'],
            "media_type" => $row['media_type'], // Added media_type
            "created_at" => $row['created_at'],
            "community" => $row['community'], // Added community
        );
    }
    
    echo json_encode([
        'status' => 'success',
        'posts' => $posts
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
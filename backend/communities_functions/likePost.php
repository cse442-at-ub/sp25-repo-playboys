<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

$data = json_decode(file_get_contents("php://input"), true);
$postId = $data["post_id"] ?? null;
$username = $data["username"] ?? null;

if (!$postId || !$username) {
    echo json_encode(["status" => "error", "message" => "Missing data"]);
    exit;
}

$stmt = $conn->prepare("INSERT IGNORE INTO post_likes (post_id, username) VALUES (?, ?)");
$stmt->bind_param("is", $postId, $username);
$success = $stmt->execute();

echo json_encode([
    "status" => $success ? "success" : "error"
]);

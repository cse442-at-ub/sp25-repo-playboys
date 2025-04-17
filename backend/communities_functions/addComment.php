<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

$data = json_decode(file_get_contents("php://input"), true);
$postId = $data["post_id"] ?? null;
$username = $data["username"] ?? null;
$comment = $data["comment"] ?? "";

if (!$postId || !$username || empty($comment)) {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO post_comments (post_id, username, comment_text) VALUES (?, ?, ?)");
$stmt->bind_param("iss", $postId, $username, $comment);
$stmt->execute();

echo json_encode(["status" => "success"]);

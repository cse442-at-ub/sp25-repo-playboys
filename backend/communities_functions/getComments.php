<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

$postId = $_GET["post_id"] ?? null;
$limit = $_GET["limit"] ?? 3;

// Fetch limited comments
$stmt = $conn->prepare("SELECT username, comment_text, created_at FROM post_comments WHERE post_id = ? ORDER BY created_at ASC LIMIT ?");
$stmt->bind_param("ii", $postId, $limit);
$stmt->execute();
$result = $stmt->get_result();
$comments = $result->fetch_all(MYSQLI_ASSOC);

// Fetch total comment count
$stmtTotal = $conn->prepare("SELECT COUNT(*) AS total FROM post_comments WHERE post_id = ?");
$stmtTotal->bind_param("i", $postId);
$stmtTotal->execute();
$totalResult = $stmtTotal->get_result();
$totalCount = $totalResult->fetch_assoc()['total'];

echo json_encode([
    "status" => "success",
    "comments" => $comments,
    "total" => (int)$totalCount
]);

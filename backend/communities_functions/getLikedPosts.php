<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

$username = $_GET["username"] ?? null;

$stmt = $conn->prepare("SELECT post_id FROM post_likes WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$liked = [];
while ($row = $result->fetch_assoc()) {
    $liked[] = (int) $row['post_id'];
}

echo json_encode(["liked" => $liked]);

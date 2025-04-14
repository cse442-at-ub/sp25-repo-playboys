<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

if (!isset($_GET["community_id"])) {
    echo json_encode(["success" => false, "message" => "Missing community ID"]);
    exit();
}

$community_id = intval($_GET["community_id"]);

$stmt = $conn->prepare(
  "SELECT p.post_id, p.caption, p.image, p.created_at, u.username
   FROM pb_posts p
   JOIN user_login_data u ON p.creator_id = u.id
   WHERE p.community_id = ?
   ORDER BY p.created_at DESC"
);
$stmt->bind_param("i", $community_id);
$stmt->execute();
$res = $stmt->get_result();

$posts = [];
while ($row = $res->fetch_assoc()) {
    $posts[] = $row;
}

echo json_encode(["success" => true, "posts" => $posts]);
?>

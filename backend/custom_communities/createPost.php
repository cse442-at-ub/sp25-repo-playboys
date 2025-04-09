<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["caption"], $data["image"], $data["community_id"], $data["username"])) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

// Get user ID from username
$stmt = $conn->prepare("SELECT id FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $data["username"]);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit();
}
$user = $res->fetch_assoc();
$creatorId = $user["id"];

// Insert the post
$stmt = $conn->prepare("INSERT INTO pb_posts (community_id, creator_id, caption, image) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiss", $data["community_id"], $creatorId, $data["caption"], $data["image"]);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Post created"]);
} else {
    echo json_encode(["success" => false, "message" => "Insert failed: " . $stmt->error]);
}
?>

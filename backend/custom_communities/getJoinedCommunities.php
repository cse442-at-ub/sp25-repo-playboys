<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

$data = json_decode(file_get_contents("php://input"), true);
$username = $data["user"] ?? null;

if (!$username) {
    echo json_encode(["status" => "error", "message" => "Missing username"]);
    exit();
}

// Get user ID
$stmt = $conn->prepare("SELECT id FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit();
}
$user_id = $res->fetch_assoc()["id"];

// Get joined communities including background_image
$stmt = $conn->prepare(
    "SELECT c.community_id, c.name, c.background_image
     FROM pb_community_members m
     JOIN pb_communities c ON m.community_id = c.community_id
     WHERE m.user_id = ?"
);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();

$communities = [];
while ($row = $res->fetch_assoc()) {
    $communities[] = [
        "id" => $row["community_id"],
        "name" => $row["name"],
        "background_image" => $row["background_image"]
    ];
}

echo json_encode(["status" => "success", "communities" => $communities]);
?>

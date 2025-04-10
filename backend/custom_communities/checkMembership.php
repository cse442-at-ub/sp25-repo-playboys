<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

$data = json_decode(file_get_contents("php://input"), true);
$username = $data["username"] ?? null;
$community_id = $data["community_id"] ?? null;

if (!$username || !$community_id) {
    echo json_encode(["is_member" => false]);
    exit;
}

$stmt = $conn->prepare("SELECT id FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$user_result = $stmt->get_result();
if ($user_result->num_rows === 0) {
    echo json_encode(["is_member" => false]);
    exit;
}
$user_id = $user_result->fetch_assoc()["id"];

$stmt = $conn->prepare("SELECT * FROM pb_community_members WHERE user_id = ? AND community_id = ?");
$stmt->bind_param("ii", $user_id, $community_id);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode(["is_member" => $result->num_rows > 0]);
?>

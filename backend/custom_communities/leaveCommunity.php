<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

$data = json_decode(file_get_contents("php://input"), true);
$username = $data["username"];
$community_id = $data["community_id"];

$stmt = $conn->prepare("SELECT id FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}
$user_id = $result->fetch_assoc()["id"];

$stmt = $conn->prepare("DELETE FROM pb_community_members WHERE user_id = ? AND community_id = ?");
$stmt->bind_param("ii", $user_id, $community_id);
$success = $stmt->execute();

echo json_encode(["success" => $success]);
?>

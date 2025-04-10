<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["user"])) {
    echo json_encode(["status" => "error", "message" => "Missing username"]);
    exit();
}

$username = $data["user"];

// Lookup user ID from username
$stmt = $conn->prepare("SELECT id FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit();
}
$user = $result->fetch_assoc();
$user_id = $user["id"];

// Get communities created by the user
$stmt = $conn->prepare("SELECT community_id, name FROM pb_communities WHERE creator_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$results = $stmt->get_result();

$communities = [];
while ($row = $results->fetch_assoc()) {
    $communities[] = [
        "id" => $row["community_id"],
        "name" => $row["name"]
    ];
}

echo json_encode([
    "status" => "success",
    "communities" => $communities
]);
?>

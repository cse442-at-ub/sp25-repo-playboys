<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

// Expect JSON input
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit();
}

if (!isset($data["user"])) {
    echo json_encode(["success" => false, "message" => "Missing username"]);
    exit();
}

$username = $data["user"];

// Step 1: Get user ID from username
$stmt = $conn->prepare("SELECT id FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit();
}
$userData = $result->fetch_assoc();
$userId = $userData["id"];
$stmt->close();

// Step 2: Get communities created by this user
$stmt = $conn->prepare("SELECT name FROM pb_communities WHERE creator_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$communities = [];
while ($row = $result->fetch_assoc()) {
    $communities[] = $row["name"];
}

echo json_encode($communities);
$conn->close();
?>

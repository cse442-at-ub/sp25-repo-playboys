<?php
ini_set('upload_max_filesize', '20M');
ini_set('post_max_size', '22M');
ini_set('memory_limit', '256M');
ini_set('max_execution_time', '60');

require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['community_name']) || trim($data['community_name']) === "" ||
    !isset($data['user_id']) || trim($data['user_id']) === ""
) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

$communityName = trim($data['community_name']);
$backgroundImage = isset($data['background_image']) ? $data['background_image'] : null;
$username = trim($data['user_id']);

// Lookup user ID from username
$userStmt = $conn->prepare("SELECT id FROM user_login_data WHERE username = ?");
$userStmt->bind_param("s", $username);
$userStmt->execute();
$result = $userStmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit();
}
$creatorId = $result->fetch_assoc()['id'];
$userStmt->close();

// Insert community
$insertStmt = $conn->prepare("INSERT INTO pb_communities (name, background_image, creator_id) VALUES (?, ?, ?)");
$insertStmt->bind_param("ssi", $communityName, $backgroundImage, $creatorId);
if (!$insertStmt->execute()) {
    echo json_encode(["success" => false, "message" => "Failed to create community: " . $insertStmt->error]);
    exit();
}
$communityId = $conn->insert_id;
$insertStmt->close();

// Auto-add creator as member
$membershipStmt = $conn->prepare("INSERT INTO pb_community_members (user_id, community_id) VALUES (?, ?)");
$membershipStmt->bind_param("ii", $creatorId, $communityId);
if (!$membershipStmt->execute()) {
    echo json_encode(["success" => false, "message" => "Failed to auto-join user: " . $membershipStmt->error]);
    exit();
}
$membershipStmt->close();

echo json_encode([
    "success" => true,
    "message" => "Community created successfully",
    "community_id" => $communityId
]);

$conn->close();
?>

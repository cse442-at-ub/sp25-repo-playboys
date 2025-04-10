<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

// Debugging line (remove after testing)
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
$username = trim($data['user_id']); // Still a username

// Lookup user ID from username
$stmt = $conn->prepare("SELECT id FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit();
}

$row = $result->fetch_assoc();
$creatorId = $row['id'];

// Insert community
$stmt = $conn->prepare("INSERT INTO pb_communities (name, background_image, creator_id) VALUES (?, ?, ?)");
$stmt->bind_param("ssi", $communityName, $backgroundImage, $creatorId);
if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Failed to create community"]);
    exit();
}
$communityId = $conn->insert_id;

// Auto-join creator as member
$stmt = $conn->prepare("INSERT INTO pb_community_members (user_id, community_id) VALUES (?, ?)");
$stmt->bind_param("ii", $creatorId, $communityId);
if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Failed to auto-join user"]);
    exit();
}

echo json_encode(["success" => true, "message" => "Community created successfully", "community_id" => $communityId]);

$stmt->close();
$conn->close();
?>

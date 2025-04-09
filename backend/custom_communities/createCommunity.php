<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit();
}

// Parse JSON body
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
$username = trim($data['user_id']); // Still a username from frontend

// 1. Look up user_login_data.id from username
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

// 2. Insert into pb_communities
$insert = $conn->prepare("INSERT INTO pb_communities (name, background_image, creator_id) VALUES (?, ?, ?)");
$insert->bind_param("ssi", $communityName, $backgroundImage, $creatorId);

if ($insert->execute()) {
    echo json_encode(["success" => true, "message" => "Community created successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Insert failed: " . $insert->error]);
}

$insert->close();
$stmt->close();
$conn->close();
?>

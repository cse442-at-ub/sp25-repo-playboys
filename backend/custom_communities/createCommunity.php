<?php
include('../config.php');
session_start();

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$communityName = $data['name'];
$backgroundImage = $data['background_image'];
$creatorId = $data['user_id']; // passed from frontend

if (!$communityName || !$creatorId) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

$stmt = $conn->prepare("INSERT INTO pb_communities (name, background_image, creator_id) VALUES (?, ?, ?)");
$stmt->bind_param("ssi", $communityName, $backgroundImage, $creatorId);

if ($stmt->execute()) {
    $communityId = $stmt->insert_id;

    // Auto join creator
    $joinStmt = $conn->prepare("INSERT INTO pb_community_members (user_id, community_id) VALUES (?, ?)");
    $joinStmt->bind_param("ii", $creatorId, $communityId);
    $joinStmt->execute();

    echo json_encode(['success' => true, 'community_id' => $communityId]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to create community']);
}
?>

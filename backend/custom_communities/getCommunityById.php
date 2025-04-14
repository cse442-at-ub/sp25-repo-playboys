<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

// Validate community ID
if (!isset($_GET["id"])) {
    echo json_encode(["status" => "error", "message" => "Missing community ID"]);
    exit();
}

$community_id = intval($_GET["id"]);

// Query to get community details including creator info
$stmt = $conn->prepare(
    "SELECT c.name, c.background_image, c.creator_id, u.username AS creator_username
     FROM pb_communities c
     JOIN user_login_data u ON c.creator_id = u.id
     WHERE c.community_id = ?"
);
$stmt->bind_param("i", $community_id);
$stmt->execute();
$result = $stmt->get_result();

// If no result, community doesn't exist
if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Community not found"]);
    exit();
}

// Return community info as JSON
$community = $result->fetch_assoc();

echo json_encode([
    "name" => $community["name"],
    "background_image" => $community["background_image"],
    "creator_id" => $community["creator_id"],
    "creator_username" => $community["creator_username"]
]);
?>

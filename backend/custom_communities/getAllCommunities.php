<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../data_base.php";

// No authentication check here — open to all users

$stmt = $conn->prepare("SELECT community_id, name, background_image FROM pb_communities ORDER BY created_at DESC");
$stmt->execute();
$result = $stmt->get_result();

$communities = [];
while ($row = $result->fetch_assoc()) {
    $communities[] = $row;
}

// Return proper JSON
header("Content-Type: application/json");
echo json_encode([
    "status" => "success",
    "communities" => $communities
]);
?>

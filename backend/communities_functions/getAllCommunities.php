<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php"; // switch to correct DB config if needed

header("Content-Type: application/json");

// Get all communities from the database
$stmt = $conn->prepare("SELECT id, community_name, picture FROM communities");
$stmt->execute();
$result = $stmt->get_result();

$communities = [];
while ($row = $result->fetch_assoc()) {
    $communities[] = [
        "id" => $row["id"],
        "name" => $row["community_name"],
        "background_image" => $row["picture"] ?: "" // fallback to blank if null
    ];
}

echo json_encode([
    "status" => "success",
    "communities" => $communities
]);
exit;
?>

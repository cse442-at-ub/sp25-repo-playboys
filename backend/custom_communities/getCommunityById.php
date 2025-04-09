<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

if (!isset($_GET["id"])) {
    echo json_encode(["status" => "error", "message" => "Missing community ID"]);
    exit();
}

$community_id = intval($_GET["id"]);

$stmt = $conn->prepare("SELECT name, background_image FROM pb_communities WHERE community_id = ?");
$stmt->bind_param("i", $community_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Community not found"]);
    exit();
}

$community = $result->fetch_assoc();
echo json_encode($community);
?>

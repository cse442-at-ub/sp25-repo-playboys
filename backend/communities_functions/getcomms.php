<?php
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/../data_base.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$user = $data["user"] ?? null;

if (!$user) {
  echo json_encode(["status" => "error", "message" => "Missing user"]);
  exit;
}

$stmt = $conn->prepare("SELECT community_name, members FROM communities");
$stmt->execute();
$result = $stmt->get_result();

$matched = [];

while ($row = $result->fetch_assoc()) {
    $members = json_decode($row["members"], true);
    if (is_array($members) && in_array($user, $members)) {
        $matched[] = $row["community_name"];
    }
}

echo json_encode($matched);
exit;

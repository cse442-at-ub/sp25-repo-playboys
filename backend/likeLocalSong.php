<?php
require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuthHeader.php";
require __DIR__ . "/data_base.php";

$input = json_decode(file_get_contents("php://input"), true);
$songName = $input["song_name"] ?? null;
$artistName = $input["artist_name"] ?? null;
$coverUrl = $input["cover_url"] ?? null;
$previewUrl = $input["preview_url"] ?? null;

if (!$songName || !$artistName) {
  echo json_encode(["status" => "error", "message" => "Missing song info"]);
  exit;
}

// Get user ID
$authToken = $_COOKIE["auth_token"];
$stmt = $conn->prepare("
  SELECT id FROM user_login_data 
  WHERE username = (SELECT username FROM cookie_authentication WHERE auth_key = ?)
");
$stmt->bind_param("s", $authToken);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
  echo json_encode(["status" => "error", "message" => "User not found"]);
  exit;
}

$userId = $user["id"];

$insert = $conn->prepare("
  INSERT INTO nonspotify_liked_songs (user_id, song_name, artist_name, cover_url, preview_url) 
  VALUES (?, ?, ?, ?, ?)
");
$insert->bind_param("issss", $userId, $songName, $artistName, $coverUrl, $previewUrl);
$insert->execute();

echo json_encode(["status" => "success"]);

?>

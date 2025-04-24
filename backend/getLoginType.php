<?php
require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuthHeader.php";
require __DIR__ . "/data_base.php";

$auth_token = $_COOKIE["auth_token"];

$stmt = $conn->prepare("
  SELECT user_login_data.spotify_id
  FROM cookie_authentication 
  JOIN user_login_data ON cookie_authentication.username = user_login_data.username
  WHERE cookie_authentication.auth_key = ?
");
$stmt->bind_param("s", $auth_token);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode([
        "status" => "success",
        "is_spotify_user" => !is_null($row["spotify_id"])
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Not found"]);
}

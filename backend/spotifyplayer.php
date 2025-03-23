<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once("config.php");
require_once("database.php");

session_start();

//Ensure user is logged in
if (!isset($_SESSION['username'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$username = $_SESSION['username'];

//Retrieve access token from DB
$stmt = $conn->prepare("SELECT access_token FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

if (!$result || empty($result['access_token'])) {
    echo json_encode(["error" => "Access token not found"]);
    exit();
}

echo json_encode([
    "access_token" => $result['access_token']
]);
?>

<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once("config.php");
require_once("database.php");

session_start();

$client_id = 'db12e6eb3b95401794029939949532d8';
$client_secret = '2ab63dda8ae04db39b2409a29820fbfc';
$redirect_uri = 'http://localhost/backend/spotify_callback.php';

if (!isset($_GET['code'])) {
    echo json_encode(["status" => "Error", "message" => "Missing code"]);
    exit();
}

$code = $_GET['code'];

// Exchange authorization code for access token
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://accounts.spotify.com/api/token');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'grant_type' => 'authorization_code',
    'code' => $code,
    'redirect_uri' => $redirect_uri,
    'client_id' => $client_id,
    'client_secret' => $client_secret,
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded'
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

if (!isset($data['access_token'])) {
    echo json_encode(["status" => "Error", "message" => "Error retrieving access token"]);
    exit();
}

$access_token = $data['access_token'];

// 🔍 Get user info from Spotify
$meCurl = curl_init();
curl_setopt($meCurl, CURLOPT_URL, "https://api.spotify.com/v1/me");
curl_setopt($meCurl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($meCurl, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $access_token"
]);

$meResponse = curl_exec($meCurl);
curl_close($meCurl);
$userData = json_decode($meResponse, true);

if (!isset($userData['id']) || !isset($userData['email'])) {
    echo json_encode(["status" => "Error", "message" => "Failed to fetch Spotify user info"]);
    exit();
}

$spotify_id = $userData['id'];
$email = $userData['email'];

// 👤 Check if Spotify user exists in DB
$stmt = $conn->prepare("SELECT username FROM user_login_data WHERE spotify_id = ?");
$stmt->bind_param("s", $spotify_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row) {
    // User exists, update token
    $username = $row['username'];
    $updateStmt = $conn->prepare("UPDATE user_login_data SET access_token = ? WHERE spotify_id = ?");
    $updateStmt->bind_param("ss", $access_token, $spotify_id);
    $updateStmt->execute();
} else {
    // User does not exist — create one
    $generated_username = "spotify_" . uniqid();
    $insertStmt = $conn->prepare("INSERT INTO user_login_data (spotify_id, username, email, access_token) VALUES (?, ?, ?, ?)");
    $insertStmt->bind_param("ssss", $spotify_id, $generated_username, $email, $access_token);
    $insertStmt->execute();
    $username = $generated_username;
}

// ✅ Set session username
$_SESSION['username'] = $username;

// Redirect to explore page
header("Location: http://localhost:3000/#/explore");
exit();

<?php
require __DIR__ . "/headers.php";
require __DIR__ . "/config.php";
require __DIR__ . "/database.php";

session_start();

if (!isset($_SESSION['spotify_uid'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$spotifyId = $_SESSION['spotify_uid'];

// Get stored refresh token from DB
$stmt = $conn->prepare("SELECT refresh_token FROM user_login_data WHERE spotify_id = ?");
$stmt->bind_param("s", $spotifyId);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$result || !$result['refresh_token']) {
    echo json_encode(["error" => "Refresh token not found"]);
    exit();
}

$refresh_token = $result['refresh_token'];

// Refresh the access token
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => "https://accounts.spotify.com/api/token",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Basic " . base64_encode($config['spotify_client_id'] . ":" . $config['spotify_client_secret']),
        "Content-Type: application/x-www-form-urlencoded"
    ],
    CURLOPT_POSTFIELDS => http_build_query([
        "grant_type" => "refresh_token",
        "refresh_token" => $refresh_token
    ])
]);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo json_encode(["error" => "cURL error: " . curl_error($ch)]);
    exit();
}
curl_close($ch);

$data = json_decode($response, true);
if (!isset($data['access_token'])) {
    echo json_encode(["error" => "Failed to refresh token"]);
    exit();
}

$newAccessToken = $data['access_token'];
$newRefreshToken = $data['refresh_token'] ?? null;

// Update tokens in DB
if ($newRefreshToken) {
    $update = $conn->prepare("UPDATE user_login_data SET access_token = ?, refresh_token = ? WHERE spotify_id = ?");
    $update->bind_param("sss", $newAccessToken, $newRefreshToken, $spotifyId);
} else {
    $update = $conn->prepare("UPDATE user_login_data SET access_token = ? WHERE spotify_id = ?");
    $update->bind_param("ss", $newAccessToken, $spotifyId);
}
$update->execute();
$update->close();

echo json_encode(["access_token" => $newAccessToken]);
?>

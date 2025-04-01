<?php
$allowedOrigins = [
    "http://localhost:3000",
    "https://se-dev.cse.buffalo.edu",
    "http://localhost"
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once("config.php");
require_once("data_base.php");

session_start();

// Ensure user is logged in
if (!isset($_SESSION['spotify_id'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$spotifyId = $_SESSION['spotify_id'];

$stmt = $conn->prepare("SELECT access_token, refresh_token FROM user_login_data WHERE spotify_id = ?");
$stmt->bind_param("s", $spotifyId);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

if (!$result || empty($result['access_token'])) {
    echo json_encode(["error" => "Access token not found"]);
    exit();
}

$access_token = $result['access_token'];
$refresh_token = $result['refresh_token'];

/**
 * Check if token is expired by calling /v1/me
 */
function isTokenExpired($token) {
    $test = curl_init("https://api.spotify.com/v1/me");
    curl_setopt_array($test, [
        CURLOPT_HTTPHEADER => ["Authorization: Bearer $token"],
        CURLOPT_RETURNTRANSFER => true
    ]);
    curl_exec($test);
    $http_code = curl_getinfo($test, CURLINFO_HTTP_CODE);
    curl_close($test);
    return $http_code === 401;
}

// If expired, refresh
if (isTokenExpired($access_token) && $refresh_token) {
    $token_url = "https://accounts.spotify.com/api/token";
    $post_fields = http_build_query([
        'grant_type'    => 'refresh_token',
        'refresh_token' => $refresh_token
    ]);
    $headers = [
        "Authorization: Basic " . base64_encode($config['spotify_client_id'] . ':' . $config['spotify_client_secret']),
        "Content-Type: application/x-www-form-urlencoded"
    ];

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $token_url,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $post_fields,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true
    ]);
    $res = curl_exec($ch);
    curl_close($ch);

    $new_token_data = json_decode($res, true);

    if (isset($new_token_data['access_token'])) {
        $access_token = $new_token_data['access_token'];

        // Update token in DB
        $update = $conn->prepare("UPDATE user_login_data SET access_token = ? WHERE spotify_id = ?");
        $update->bind_param("ss", $access_token, $spotifyId);
        $update->execute();
    } else {
        echo json_encode(["error" => "Unable to refresh access token"]);
        exit();
    }
}

echo json_encode([
    "access_token" => $access_token
]);
?>

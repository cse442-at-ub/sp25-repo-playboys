<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

// Database config
$host = 'https://se-dev.cse.buffalo.edu/';
$dbname = 'cse442_2025_spring_team_ah_db';
$db_user = 'ronaldzh';
$db_pass = 'your_db_password';

// Input validation
if (!isset($_GET['user']) || !isset($_GET['playlist'])) {
    echo json_encode(["status" => "error", "message" => "Missing user or playlist parameter."]);
    exit;
}

$user = $_GET['user'];
$playlistName = $_GET['playlist'];

// Connect to MySQL
$conn = new mysqli($host, $db_user, $db_pass, $dbname);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed."]);
    exit;
}

// Get access token
$stmt = $conn->prepare("SELECT access_token FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $access_token = $row['access_token'];
} else {
    echo json_encode(["status" => "error", "message" => "User not found or no access token."]);
    exit;
}
$stmt->close();

// Get user's playlists from Spotify
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.spotify.com/v1/me/playlists");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $access_token"
]);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
if (!isset($data['items'])) {
    echo json_encode(["status" => "error", "message" => "Failed to retrieve playlists from Spotify."]);
    exit;
}

// Find the matching playlist by name
$playlistImage = null;
foreach ($data['items'] as $item) {
    if (strtolower($item['name']) === strtolower($playlistName)) {
        if (!empty($item['images'])) {
            $playlistImage = $item['images'][0]['url'];
        }
        break;
    }
}

if ($playlistImage) {
    echo json_encode(["status" => "success", "imageUrl" => $playlistImage]);
} else {
    echo json_encode(["status" => "error", "message" => "Playlist image not found."]);
}

$conn->close();
?>

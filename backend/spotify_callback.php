<?php
require __DIR__ . "/headers.php";
require __DIR__ . '/data_base.php';
$config = include __DIR__ . '/config.php';
$client_id     = $config['spotify_client_id'];
$client_secret = $config['spotify_client_secret'];
$redirect_uri  = $config['spotify_redirect_uri'];

session_start();
echo "DEBUG: Starting Spotify callback process<br>";

// Step 1: Check for authorization code
if (!isset($_GET['code'])) {
    echo "DEBUG: Authorization code not provided.<br>";
    echo json_encode(["status" => "Error", "message" => "Error retrieving authorization code."]);
    exit();
}
$code = $_GET['code'];
echo "DEBUG: Received authorization code: $code<br>";

// Step 2: Exchange code for access token
$token_url = "https://accounts.spotify.com/api/token";
$post_fields = http_build_query([
    'grant_type'   => 'authorization_code',
    'code'         => $code,
    'redirect_uri' => $redirect_uri
]);
$headers = [
    'Authorization: Basic ' . base64_encode($client_id . ':' . $client_secret),
    'Content-Type: application/x-www-form-urlencoded'
];

echo "DEBUG: Requesting access token from Spotify<br>";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL            => $token_url,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $post_fields,
    CURLOPT_HTTPHEADER     => $headers,
    CURLOPT_RETURNTRANSFER => true
]);
$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo "DEBUG: cURL error during token exchange: " . curl_error($ch) . "<br>";
    exit("DEBUG: cURL error during token exchange.");
}
curl_close($ch);

echo "DEBUG: Spotify token response: $response<br>";
$token_data = json_decode($response, true);
if (!isset($token_data['access_token'])) {
    echo "DEBUG: Access token not received. Response: $response<br>";
    echo json_encode(["status" => "Error", "message" => "Error retrieving access token"]);
    exit();
}

$access_token = $token_data['access_token'];
setcookie('spotify_access_token', $access_token, [
    'expires' => time() + 3600,
    'path' => '/'
]);
$refresh_token = $token_data['refresh_token'] ?? null;
echo "DEBUG: Received access token: $access_token<br>";

// Step 3: Get Spotify user info
$user_profile_url = "https://api.spotify.com/v1/me";
echo "DEBUG: Requesting user profile from Spotify<br>";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL            => $user_profile_url,
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $access_token],
    CURLOPT_RETURNTRANSFER => true
]);
$user_response = curl_exec($ch);
if (curl_errno($ch)) {
    echo "DEBUG: cURL error during user info retrieval: " . curl_error($ch) . "<br>";
    exit("DEBUG: cURL error during user info retrieval.");
}
curl_close($ch);
echo "DEBUG: Spotify user profile response: $user_response<br>";

$user_info = json_decode($user_response, true);
if (!isset($user_info['id'])) {
    echo "DEBUG: User ID not found in response. Response: $user_response<br>";
    exit("DEBUG: Error retrieving user information.");
}

$spotify_id   = $user_info['id'];
$display_name = $user_info['display_name'] ?? '';
$email        = $user_info['email'] ?? '';
echo "DEBUG: User info retrieved - ID: $spotify_id, Display Name: $display_name, Email: $email<br>";

// Step 4: Check if user exists in DB
echo "DEBUG: Checking if user exists in database<br>";
$login_user = $conn->prepare("SELECT * FROM user_login_data WHERE spotify_id = ?");
$login_user->bind_param("s", $spotify_id);
$login_user->execute();
$result = $login_user->get_result();

if ($result->num_rows === 0) {
    echo "DEBUG: User not found in database. Registering new user.<br>";

    $insert_new_user = $conn->prepare("INSERT INTO user_login_data (access_token, refresh_token, email, username, spotify_id) VALUES (?, ?, ?, ?, ?)");
    if (!$insert_new_user) {
        echo "DEBUG: Database prepare error (insert_new_user): " . $conn->error . "<br>";
        exit("DEBUG: Database error during prepare (insert_new_user).");
    }
    $insert_new_user->bind_param("sssss", $access_token, $refresh_token, $email, $display_name, $spotify_id);
    $insert_new_user->execute();
    echo "DEBUG: New user inserted into user_login_data<br>";
    $insert_new_user->close();

    // Profile setup
    $username = $display_name;
    $followers = 0;
    $followings = 0;
    $friends = 0;
    $top_songs = "";
    $top_artists = "";
    $recent_activity = "";
    $profile_pic = "";

    $insert_new_profile = $conn->prepare("INSERT INTO user_profiles (username, email, friends, followers, followings, top_songs, top_artists, recent_activity, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$insert_new_profile) {
        echo "DEBUG: Database prepare error (insert_new_profile): " . $conn->error . "<br>";
        exit("DEBUG: Database error during prepare (insert_new_profile).");
    }
    $insert_new_profile->bind_param("ssissssss", $username, $email, $friends, $followers, $followings, $top_songs, $top_artists, $recent_activity, $profile_pic);
    $insert_new_profile->execute();
    $insert_new_profile->close();
    echo "DEBUG: New user inserted into user_profiles<br>";
}

// Step 5: Handle session + cookies for all users
$token = bin2hex(random_bytes(32));
$csrf_token = bin2hex(random_bytes(32));
echo "DEBUG: Generated new auth token: $token<br>";

$delete_old_keys = $conn->prepare("DELETE FROM cookie_authentication WHERE username = ?");
$delete_old_keys->bind_param("s", $display_name);
$delete_old_keys->execute();
$delete_old_keys->close();
echo "DEBUG: Old auth tokens deleted<br>";

$insert_key = $conn->prepare("INSERT INTO cookie_authentication (username, auth_key, csrf_token) VALUES (?, ?, ?)");
$insert_key->bind_param("sss", $display_name, $token, $csrf_token);
$insert_key->execute();
$insert_key->close();
echo "DEBUG: New auth token inserted<br>";

setcookie('auth_token', $token, [
    'expires' => time() + 3600,
    'path' => '/'
]);
echo "DEBUG: Auth token cookie set<br>";

$_SESSION['username'] = $display_name;
$_SESSION['spotify_id'] = $spotify_id;

echo "DEBUG: Redirecting user to profile page<br>";
header('Location: ' . $config['frontend_url'] . '#/userprofile');
exit();
?>
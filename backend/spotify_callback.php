<?php
// spotify_callback.php
require __DIR__ . "/headers.php";

$config = include __DIR__ . '/config.php';
$client_id     = $config['spotify_client_id'];
$client_secret = $config['spotify_client_secret'];
$redirect_uri  = $config['spotify_redirect_uri'];

session_start();

// 1. Check if an authorization code is provided
if (!isset($_GET['code'])) {
    echo json_encode(["status" => "Error", "message" => "Error retrieving authorization code."]);
    // exit('No authorization code provided.');
    exit();
}

$code = $_GET['code'];


// 3. Exchange the authorization code for an access token
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

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL            => $token_url,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $post_fields,
    CURLOPT_HTTPHEADER     => $headers,
    CURLOPT_RETURNTRANSFER => true
]);
$response = curl_exec($ch);
curl_close($ch);

$token_data = json_decode($response, true);

if (!isset($token_data['access_token'])) {
    echo json_encode(["status" => "Error", "message" => "Error retrieving access token"]);
    exit();
}

$access_token = $token_data['access_token'];
// Optionally handle refresh token and expiration if needed

// 4. Use the access token to fetch the user's profile data from Spotify
$user_profile_url = "https://api.spotify.com/v1/me";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL            => $user_profile_url,
    CURLOPT_HTTPHEADER     => [ 'Authorization: Bearer ' . $access_token ],
    CURLOPT_RETURNTRANSFER => true
]);
$user_response = curl_exec($ch);
curl_close($ch);

$user_info = json_decode($user_response, true);
// Check required fields exist
if (!isset($user_info['id'])) {
     exit('Error retrieving user information.');
}

$spotify_id   = $user_info['id'];
$display_name = isset($user_info['display_name']) ? $user_info['display_name'] : '';
$email        = isset($user_info['email']) ? $user_info['email'] : '';



// // check if user exists in database
$login_user = $conn->prepare("SELECT * FROM user_login_data WHERE username = ?");
$login_user->bind_param("s", $display_name);
$login_user->execute();
$result = $login_user->get_result();


// // if user doesnt exist we register them
if ($result->num_rows === 0) {
    //prepare sql statement and bind parameters
    $insert_new_user = $conn->prepare("INSERT INTO user_login_data (access_token, email, username, spotify_id) VALUES (?, ?, ?, ?)");
    $insert_new_user->bind_param("ssss",$access_token, $email, $display_name, $spotify_id);

    //insert newly registered user into database
    $insert_new_user->execute();


    //trim and grab data sent from json object from router.php
    $username = $spotify_id;
    $followers = 0;
    $followings = 0;
    $friends = 0;
    $top_songs = "";
    $top_artists = "";
    $recent_activity = "";
    $profile_pic = "";

  
    //make new user profile table for new user
    $insert_new_profile = $conn->prepare("INSERT INTO user_profiles (username, email, friends, followers, followings, top_songs, top_artists, recent_activity, profile_pic) VALUES (?, ?, ? , ? , ? , ? , ? , ?, ?)");
    $insert_new_profile->bind_param("sssssssss", $username, $email, $friends, $followers, $followings, $top_songs, $top_artists, $recent_activity);
    $insert_new_profile->execute();


    //generate random token
    $token = bin2hex(random_bytes(32));
    //add auth_key: will act as a token for user confirmation
    $delete_old_keys = $conn->prepare("DELETE FROM cookie_authentication WHERE username = ?");
    $delete_old_keys->bind_param("s", $display_name);
    $delete_old_keys->execute();
    $delete_old_keys->close();
    
    $insert_key = $conn->prepare("INSERT INTO cookie_authentication (username, auth_key) VALUES (?, ?)");
    $insert_key->bind_param("ss", $display_name, $token);
    $insert_key->execute();
    $insert_key->close();
    setcookie('auth_token', $token, [
        'expires' => time() + 3600,
        'path' => '/'
    ]);
    header('Location: ' . $config['frontend_url'] . '#/userprofile');

    //garbage collection
    $insert_new_user->close();
    $insert_new_profile->close();
    $conn->close();
}
// they were already registered so we log them in
else{
    //generate random token
    $token = bin2hex(random_bytes(32));
    //add auth_key: will act as a token for user confirmation
    $delete_old_keys = $conn->prepare("DELETE FROM cookie_authentication WHERE username = ?");
    $delete_old_keys->bind_param("s", $display_name);
    $delete_old_keys->execute();
    $delete_old_keys->close();
    
    $insert_key = $conn->prepare("INSERT INTO cookie_authentication (username, auth_key) VALUES (?, ?)");
    $insert_key->bind_param("ss", $display_name, $token);
    $insert_key->execute();
    $insert_key->close();

    // Set session for Song Recommendation
    $_SESSION['username'] = $spotify_id;
    
    setcookie('auth_token', $token, [
        'expires' => time() + 3600,
        'path' => '/'
    ]);
    header('Location: ' . $config['frontend_url'] . '#/userprofile');

    // echo json_encode(["status" => "success", "message" => "User logged in successfully"]);
}
// Redirect the user to a protected area or dashboard
exit;
?>
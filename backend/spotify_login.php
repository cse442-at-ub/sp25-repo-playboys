<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
// login.php
require __DIR__ . "/headers.php";
$config = include __DIR__ . '/config.php';

$client_id = 'db12e6eb3b95401794029939949532d8';
$redirect_uri = 'http://localhost/backend/spotify_callback.php';
$scope = 'user-read-private user-read-email streaming';

//echo "Hello from Spotify Callback!";

// Spotify's authorization endpoint
$auth_url = 'https://accounts.spotify.com/authorize' . '?' . http_build_query([
    'response_type' => 'code',
    'client_id'     => $client_id,
    'scope'         => $scope,
    'redirect_uri'  => $redirect_uri
]);

// Redirect to Spotify login
header('Location: ' . $auth_url);
exit;
?>

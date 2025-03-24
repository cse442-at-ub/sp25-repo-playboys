<?php
// login.php
require __DIR__ . "/headers.php";
$config = include __DIR__ . '/config.php';

$client_id     = $config['spotify_client_id'];
$client_secret = $config['spotify_client_secret'];
$redirect_uri  = $config['spotify_redirect_uri'];

echo "Hello from Spotify Callback!";

// Spotify's authorization endpoint
$auth_url = 'https://accounts.spotify.com/authorize?' . http_build_query([
    'response_type' => 'code',
    'client_id'     => $client_id,
    'scope'         => $scope,
    'redirect_uri'  => $redirect_uri
]);

// Redirect to Spotify login
header('Location: ' . $auth_url);
exit;
?>

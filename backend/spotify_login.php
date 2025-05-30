<?php
require_once("config.php");

$config = include("config.php");
$client_id = $config['spotify_client_id'];
$redirect_uri = $config['spotify_redirect_uri'];
$scopes = [
    'user-read-email',
    'user-read-private',
    'streaming',
    'user-modify-playback-state',
    'user-read-playback-state',
    'user-top-read',
    'playlist-read-collaborative',
    'playlist-read-private',
    'playlist-modify-private',
    'playlist-modify-public'
];

$scope_param = implode(' ', $scopes);

$auth_url = "https://accounts.spotify.com/authorize?" . http_build_query([
    'response_type' => 'code',
    'client_id'     => $client_id,
    'scope'         => $scope_param,
    'redirect_uri'  => $redirect_uri,
    'show_dialog'   => 'true',
    'prompt'        => 'consent'
]);

header("Location: $auth_url");
exit();

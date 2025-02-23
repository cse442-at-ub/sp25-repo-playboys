<?php

// Start a session to store user authentication data
session_start();

// Include configuration file with client ID/Secret and redirect URL
$config = include('config.php');

// If there is no code in the URL, redirect user to Spotify authentication
if (!isset($_GET['code'])) {
    $auth_url = "https://accounts.spotify.com/authorize?" . http_build_query([
        'response_type' => 'code', // Request authorization code
        'client_id' => $config['client_id'], // Spotify client ID
        'redirect_uri' => $config['redirect_uri'], // Redirect URI after authentication
        'scope' => 'user-read-private user-read-email', // Requested user data permissions
    ]);
    
    // Redirect user to Spotify's authorization page
    header("Location: $auth_url");
    exit;
} else {
    // Retrieve the authorization code from the URL
    $code = $_GET['code'];
    
    // Spotify API endpoint
    $token_url = "https://accounts.spotify.com/api/token";
    
    // Send a POST request to exchange authorization code for access token
    $response = file_get_contents($token_url, false, stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query([
                'grant_type' => 'authorization_code', // Specify the grant type
                'code' => $code, // Authorization code obtained earlier
                'redirect_uri' => $config['redirect_uri'], // Must match the redirect URI used in authorization request
                'client_id' => $config['client_id'], // Client ID
                'client_secret' => $config['client_secret'], // Client Secret
            ]),
        ],
    ]));
    
    // Decode the JSON response from Spotify
    $token_data = json_decode($response, true);
    
    // Store access token in session for later use
    $_SESSION['access_token'] = $token_data['access_token'];
    
    // Redirect to profile page after successful authentication
    header("Location: profile.php");
    exit;
}

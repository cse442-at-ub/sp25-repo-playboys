<?php

$config = include __DIR__ . '/config.php';
$clientId = $config['spotify_client_id'];
$clientSecret = $config['spotify_client_secret'];
$url = 'https://accounts.spotify.com/api/token';
$headers = [
    'Authorization: Basic ' . base64_encode($clientId . ':' . $clientSecret),
    'Content-Type: application/x-www-form-urlencoded'
];
$postFields = 'grant_type=client_credentials';

// Initialize cURL session
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);

if (curl_errno($ch)) {
    throw new Exception('cURL error: ' . curl_error($ch));
}
curl_close($ch);

// Decode the JSON response
$result = json_decode($response, true);

if (isset($result['access_token'])) {
    setcookie('spotify_access_token', $result['access_token'], [
        'expires' => time() + 3600,
        'path' => '/'
    ]);
} else {
    throw new Exception('Failed to obtain access token: ' . $response);
}
?>
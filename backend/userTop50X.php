<?php
require __DIR__ . "/headers.php";
require __DIR__ . "/userDatabaseGrabber.php";
require __DIR__ . "/cookieAuthHeader.php";

header( "Content-Type: application/json" );

//Check if the user is logged in with spotify
$user = $result->fetch_assoc();

$username = $user["username"];

$spotifyId = "";

// $_GET parameters from how we call the backend
$type = $_GET["type"] ?? "artists";
$time_range = $_GET["time_range"] ?? "medium";

// Try to fetch the users Spotify id and access token. Does something go wrong?
try 
{
    // MySQL query
    $stmt = $conn->prepare("SELECT spotify_id, access_token FROM user_login_data WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();

    // Users Spotify id and access token!
    $access_token = $row['access_token'];
    $spotifyId = $row['spotify_id'];
}
catch ( Exception $e ) 
{
    // Something went wrong.
    echo json_encode([
        "status" => "error",
        "message" => "Database error. Please try again."
    ]);
    exit();
}

// And if we don't find it? They do not have a Spotify account connected.
if( $spotifyId === "" || $spotifyId == NULL )
{
    echo json_encode([
        "status" => "error",
        "message" => "Please connect your Spotify account to continue."
    ]);
    exit();
}

// cURL request to Spotify API
$url = "https://api.spotify.com/v1/me/top/$type?limit=50&time_range=$time_range";

$ch = curl_init();
curl_setopt_array( $ch, [
        CURLOPT_URL            => $top_artists_url,
        CURLOPT_HTTPHEADER     => [ "Authorization: Bearer $access_token" ],
        CURLOPT_RETURNTRANSFER => true
]);

$response = curl_exec( $ch );
if ( curl_errno( $ch ) ) 
{
    echo json_encode( [
        "status" => "error", 
        "message" => "encountered cURL error: " . curl_error( $ch ),
    ]);
} 
else 
{
    $httpCode = curl_getinfo( $ch, CURLINFO_HTTP_CODE );

    // Did the cURL request succeed?
    if ( $httpCode !== 200 ) 
    {
        echo json_encode( [
            "status" => "error", 
            "message" => "$httpCode: Failed to fetch data from Spotify. Please try again.",
        ]);
        exit();
    }
}

curl_close( $ch );

// It did! We've got the users listening data! Make it a dictionary.
$page = json_decode( $response, true );

// Check to see if the user has ever even listened to music before lol
if( $page[ "total" ] <= 0 ) 
{
    echo json_encode( [
        "status" => "error", 
        "message" => "Fetched user data from Spotify, but there is none. User literally does not listen to music.",
    ]);
    exit();
}

// User has listened to music before. Cool. Take everything we need and hand it back to frontend.
$data = [];
$index = 0;
foreach ( $page[ "items" ] as $item )
{
    $data[] = [ 
        "rank" => $index,
        "image" => $item[ "images" ][ 0 ][ "url" ],
        "name" => $item[ "name" ], 
        "popularity" => $item[ "popularity" ]];
    $index++;
}

echo json_encode( $data );
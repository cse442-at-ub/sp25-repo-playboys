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
        CURLOPT_URL            => $url,
        CURLOPT_HTTPHEADER     => [ "Authorization: Bearer $access_token" ],
        CURLOPT_RETURNTRANSFER => true
]);

$response = curl_exec( $ch );

curl_close( $ch );

// It did! We've got the users listening data! Make it a dictionary.
$page = json_decode( $response, true );

if( isset( $page[ "error" ] ) ){
    echo json_encode( [ "error" => $response ] );
    exit();
}

$data = [];
$index = 1;

foreach ( $page[ "items" ] as $item )
{
    $image = "";
    if ($type === "tracks") {
        $image = $item['album']['images'][0]['url'] ?? "";
    } else if ($type === "artists") {
        $image = $item['images'][0]['url'] ?? "";
    }

    $data[] = [ 
        "rank" => $index,
        "image" => $image,
        "name" => $item[ "name" ], 
        "popularity" => $item[ "popularity" ]
    ];
    $index++;
}


echo json_encode( $data );
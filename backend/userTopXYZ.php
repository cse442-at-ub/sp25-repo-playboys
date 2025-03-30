<?php
/*Going to call spotify API for user top artist, if the user isn't logined with spotify call deezer api for random artist for now*/

require __DIR__ . "/headers.php";
require __DIR__ . "/userDatabaseGrabber.php";
require __DIR__ . "/cookieAuthHeader.php";
/*grabing spotify user_token from refresh_token.php*/

//check if the user is logged in with spotify

$user = $result->fetch_assoc();
$login_username = $user["username"];
$spotifyId = "";

if( !isset( $data["type"] ) || !isset( $data["limit"] ) || !isset( $data["time_range"] ) ) 
{
    echo json_encode( ["error" => "Could not fetch specified Spotify data. Please try again."] );
    exit();
}

$type = $data["type"];
$limit = $data["limit"];
$time_range = $data["time_range"];

//grab token from database
$stmt = $conn->prepare("SELECT access_token, spotify_id FROM user_login_data WHERE username = ?");
$stmt->bind_param("s", $login_username);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();
$top_xyz_url = "https://api.spotify.com/v1/me/top/$type?limit=$limit&time_range=$time_range";// Fetches top 10 tracks
$access_token = $result['access_token'];
$spotifyId = $result['spotify_id'];

if( $spotifyId == "" || $spotifyId == NULL )
{
    echo json_encode( [ "error" => "Please login with Spotify" ] );
    exit();
}

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL            => $top_xyz_url,
    CURLOPT_HTTPHEADER     => ["Authorization: Bearer $access_token"],
    CURLOPT_RETURNTRANSFER => true
]);
$response = curl_exec($ch);
curl_close($ch);
$top_xyz = json_decode($response, true);

if(isset($top_xyz['error'])){
    echo json_encode(["error" => $response]);
    exit();
}

$data = [];
if ( $type === "artists" ) 
{
    foreach ($top_xyz['items'] as $artists)
    {
        $data[] = ['name' => $artists['name'], 'image' =>$artists['images'][0]['url']];
    }
}
else if ( $type === "tracks" ) 
{
    foreach ($top_xyz['items'] as $tracks)
    {
        $data[] = ['name' => $tracks['name'], 'image' =>$tracks['images'][0]['url']];
    }
}
else
{
    echo json_encode( [ "error" => "Forbidden item type selected. Please try again." ] );
    exit();
}

foreach ($top_xyz['items'] as $artists){
    $data[] = ['name' => $artists['name'], 'image' =>$artists['images'][0]['url']];

}

echo json_encode($data);

?>
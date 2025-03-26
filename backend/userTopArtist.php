<?php
/*Going to call spotify API for user top artist, if the user isn't logined with spotify call deezer api for random artist for now*/

require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuthHeader.php";
require __DIR__ . "/userDatabaseGrabber.php";
/*grabing spotify user_token from refresh_token.php*/
session_start();
//check if the user is logged in with spotify
$is_login_with_spotify = 1;
if (!isset($_SESSION['spotify_uid'])) {
    $is_login_with_spotify = 0;
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}
$spotifyId = $_SESSION['spotify_uid'];

//$result is from cookieAuth.php and is the username of the user
$user = $result->fetch_assoc();
$login_username = $user["username"];

//grab token from database
$stmt = $conn->prepare("SELECT access_token FROM user_login_data WHERE spotify_id = ?");
$stmt->bind_param("s", $spotifyId);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();
$top_tracks_url = "https://api.spotify.com/v1/me/top/artists?limit=10&time_range=medium_term";// Fetches top 10 tracks
$access_token = $result['access_token'];

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL            => $top_tracks_url,
    CURLOPT_HTTPHEADER     => ["Authorization: Bearer $access_token"],
    CURLOPT_RETURNTRANSFER => true
]);
$response = curl_exec($ch);
curl_close($ch);
$top_artists = json_decode($response, true);

if(isset($top_artists['error'])){
    echo json_encode(["error" => $response]);
    exit();
}

$data = [];
foreach ($top_artists['items'] as $artists){
    $data[] = ['name' => $artists['name'], 'image' =>$artists['images'][0]['url']];

}

echo json_encode($data);

?>
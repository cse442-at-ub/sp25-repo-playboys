<?php
// create community
// file will create a community in the database if it does not exist
// if it does it will return a message
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/community_db.php";

// get the data from the request
$data = json_decode(file_get_contents("php://input"), true); // decode JSON body
$community = $data["name"] ?? null;
$picture = $data["image"] ?? null;
$user = $data["user"] ?? null;

echo json_encode(getCommunties($conn, $user));
?>
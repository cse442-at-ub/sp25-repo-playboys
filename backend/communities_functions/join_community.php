<?php
// this file is currently not being used by the frontend but it can be used if we want clearer ui
// file going to take in a user id and a community id
require __DIR__ . "/../headers.php";
require __DIR__ . "/../cookieAuthHeader.php";
require __DIR__ . "/community_db.php";

// get the data from the request
$data = json_decode(file_get_contents("php://input"), true); // decode JSON body
$community = $data["name"] ?? null;
$picture = $data["image"] ?? null;
$user = $data["user"] ?? null;

echo json_encode(addUser($conn, $community, $user));
?>
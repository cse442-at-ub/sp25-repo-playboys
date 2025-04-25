<?php
require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuthHeader.php";

$user = $result->fetch_assoc();
$login_username = $user["username"];

echo json_encode(["login_user" => $login_username]);

?>
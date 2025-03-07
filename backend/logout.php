<?php
require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuthHeader.php";


try{
    $stmt_cookie = $conn->prepare("DELETE FROM cookie_authentication WHERE auth_key = ?");
    $stmt_cookie->bind_param("s", $auth_token);
    $stmt_cookie->execute();
    echo json_encode(["status" => "success", "message" => "Successfully logouted"]);
    exit();
}catch (Exception $e) {
    echo json_encode(["status" => "success", "message" => "Successfully logouted anyways"]);
    exit();


}
?>
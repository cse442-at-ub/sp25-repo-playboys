<?php
    require "backend/data_base.php";
    require "backend/user_auth.php";

    $requested_uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH); //grab the requested path
    $method = $_SERVER["REQUEST_METHOD"]; //protocol method
    $data = json_decode((file_get_contents("php://input")), true); //decode json data sent over(more secure), will be null if no json data sent

    //check the requested path and method
    if($requested_uri === "/") {
        readfile("frontend/test_register.html");
        exit();
    }
    else if($requested_uri ==="/register" && $method === "POST") {
        register($user_info_conn, $data);
    }
    else if($requested_uri === "/login" && $method === "POST") {
        login($user_info_conn, $data);
    }
    else {
        echo json_encode(["status" => "error", "message" => "Invalid Request"]);
    }


?>



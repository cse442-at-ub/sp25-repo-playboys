<?php
    require "backend/database.php";
    require "backend/user_auth.php";

    $requested_uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH); //grab the requested path
    
    $allowed_route = ["/" => ["GET"], "/register" => ["POST"], "/login" => ["POST"]]; //allowed routes should be added here

    $method = $_SERVER["REQUEST_METHOD"]; //protocol method
    $data = json_decode((file_get_contents("php://input")), true); //decode json data sent over(more secure), will be null if no json data sent


    //check if the requested path along their methods is allowed
    if(!array_key_exists($requested_uri, $allowed_route) || !in_array($method, $allowed_route[$requested_uri])) {
        echo json_encode(["status" => "error", "message" => "Invalid Request"]);
        http_response_code(403);
        exit();
    }


    //paths 
    if($requested_uri === "/") {
        readfile("frontend/test_register_login.html");
        exit();
    }
    else if($requested_uri ==="/register") {
        register($user_info_conn, $data);
    }
    else if($requested_uri === "/login") {
        login($user_info_conn, $data);
    } 

?>
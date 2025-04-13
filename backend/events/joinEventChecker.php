<?php
    require __DIR__ . "/../headers.php";
    require __DIR__ . "/../cookieAuthHeader.php";
    require __DIR__ . "/../userDatabaseGrabber.php";
    $user = $result->fetch_assoc();
    $login_username = $user["username"];
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data["eventId"] ?? null; // Get event ID from the request body
    if ($id === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing eventId']);
        exit;
    }
    //check if user already in event
    if(checkUserinEvents($conn, $login_username, $id)){
        echo json_encode(["status" => "joined", "message" => "Already joined the event"]);
        exit();
    }else{
        echo json_encode(["status"=> "join", "message" => "Join"]);
    }

    ?>
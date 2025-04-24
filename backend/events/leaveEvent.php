<?php 
    require __DIR__ . "/../headers.php";
    require __DIR__ . "/../cookieAuthHeader.php";
    require __DIR__ . "/../userDatabaseGrabber.php";
    $user = $result->fetch_assoc();
    $login_username = $user["username"];
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data["eventId"] ?? null; 
    // check if id exist
    if ($id === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing eventId']);
        exit();
    }
    //check if user is the creator
    if(eventCreatorFetch($conn, $id) == $login_username){
        echo json_encode(["status" => "error", "message" => "You cannot leave your own event"]);
        exit();
    }

    $delete_participants = $conn->prepare ("
    DELETE FROM event_participants WHERE id = ? AND username = ?
    ");
    $delete_participants->bind_param("ss", $id, $login_username);
    $delete_participants->execute();
    $delete_participants->close();
    //return success to frontend
    echo json_encode(['status' => 'success', 'message' => 'Left the event successfully']);
    exit();

?>
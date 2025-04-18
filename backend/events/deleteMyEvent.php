<?php 
    require __DIR__ . "/../headers.php";
    require __DIR__ . "/../cookieAuthHeader.php";
    require __DIR__ . "/../userDatabaseGrabber.php";
    $user = $result->fetch_assoc();
    $login_username = $user["username"];

    //grab request event id user wants to delete
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data["eventId"] ?? null; 

    //check if user made the event 
    if($login_username != eventCreatorFetch($conn, $id)){
        echo json_encode(['error' => 'Not the creator']);
        exit();
    }

    //delete event in artist_event database
    $delete_stmt = $conn->prepare("
    DELETE FROM artist_events 
    WHERE id = ?
    ");
    $delete_stmt->bind_param("s", $id);
    $delete_stmt->execute();

    //delete all participants in events
    $delete_participants = $conn->prepare ("
    DELETE FROM event_participants WHERE id = ?
    ");
    $delete_participants->bind_param("s", $id);
    $delete_participants->execute();

    //return success to frontend
    echo json_encode(['status' => 'success', 'message' => 'Event deleted successfully']);
    exit();


?>
<?php
    require __DIR__ . "/../headers.php";
    require __DIR__ . "/../cookieAuthHeader.php";
    require __DIR__ . "/../userDatabaseGrabber.php";
    
    $user = $result->fetch_assoc();
    $login_username = $user["username"];

    //fetch all event id related to login user
    $stmt = $conn->prepare("SELECT id FROM event_participants WHERE username = ?");
    $stmt->bind_param("s", $login_username);
    $stmt->execute();
    $result = $stmt->get_result();
    if($result->num_rows <=0 ){
        echo json_encode(["status" => "none", "message"=> "user has not joined a event"]);
        exit();
    }

    //fetch all events data that the login user joined
    $total_events = [];
    while($row = $result->fetch_assoc()){
        $event_stmt = $conn->prepare("SELECT id, title, location, date, time, image_url, creator FROM artist_events WHERE id = ?");
        $event_stmt->bind_param("s", $row["id"]);
        $event_stmt->execute();
        $event_result = $event_stmt->get_result();
        if($event_result && $event_result->num_rows > 0){
            $event_row = $event_result->fetch_assoc();
            $total_events[] = $event_row;
        }

    }

    //order all event dates from closest to furthest (will only take closest 3)
    usort($total_events, function($date1, $date2) {
        return strtotime($date1["date"]) <=> strtotime($date2["date"]);

    });
    $total_events = array_slice($total_events, 0, 3);

    //convert time to more readable versions
    foreach($total_events as &$e){
        $e["date"] = convertToShortDate($e["date"]);
        $e["time"] = convertTo12Hour($e["time"]);
    }
  
    echo json_encode(["status" => "success", "data" => $total_events]);

?>
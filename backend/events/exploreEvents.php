<?php
    require __DIR__ . "/../headers.php";
    require __DIR__ . "/../cookieAuthHeader.php";
    require __DIR__ . "/../userDatabaseGrabber.php";

    $event_stmt = $conn->prepare("SELECT id, title, location, date, time, image_url, creator FROM artist_events");
    $event_stmt->execute();
    $result = $event_stmt->get_result();
    $events = [];
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
    if(empty($events)){
        echo json_encode(["status" => "error", "message" => "no events found"]);
        exit();
    }
    usort($events, function($date1, $date2) {
        return strtotime($date1["date"]) <=> strtotime($date2["date"]);
    });
    //delete events that are in the past
    foreach($events as  $e){
        if(fulldatatime_checker($e["date"], $e["time"]) == false){
            deleteEvent($conn, $e["id"]);
        } else {
            break;
        }
    }
    $events = array_slice($events, 0, 3);
    foreach($events as &$e){
        $e["date"] = convertToShortDate($e["date"]);
        $e["time"] = convertTo12Hour($e["time"]);
    }
    echo json_encode(["status" => "success", "data" => $events]);
    exit();

    ?>
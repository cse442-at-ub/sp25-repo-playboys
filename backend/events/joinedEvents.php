<?php
    require __DIR__ . "/../headers.php";
    require __DIR__ . "/../cookieAuthHeader.php";
    require __DIR__ . "/../userDatabaseGrabber.php";
    
    $user = $result->fetch_assoc();
    $login_username = $user["username"];
    $headers = getallheaders();
    //fetch all event id related to login user
    $user = $login_username;
    if(isset($headers["page-source"]) && $headers["page-source"] === "profile"){
        $user = $_GET["user"];
        if($user == null || $user == "" || $user == $login_username || empty($user)){
            $user = $login_username;
        }
    }

    $stmt = $conn->prepare("SELECT id FROM event_participants WHERE username = ?");
    $stmt->bind_param("s", $user);
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

    //if data is being request from sidebar
    $data = [];
    if(isset($headers["page-source"]) && $headers["page-source"] === "sidebar"){
        foreach($total_events as $e){
            $e_object = ["title" => $e["title"], 
                         "image" => $e["image_url"],
                         "id" => $e["id"]];
            $data[] = $e_object;
        }
        echo json_encode(["status" => "success", "data" => $data]);
        exit();
    }
    if(isset($headers["page-source"]) && $headers["page-source"] === "profile"){
        foreach($total_events as $e){
            if(fulldatatime_checker($e["date"], $e["time"]) == false){
                deleteEvent($conn, $e["id"]);
                
            }else {
                $e_object = ["date" => formatDateToMDY($e["date"]),
                "time" => convertTo12Hour($e["time"]),
                "location" => $e["location"],
                "name" => $e["title"], 
                "artist" => $e["creator"],
                "image" => $e["image_url"],
                "id" => $e["id"],
                
               ];
                $data[] = $e_object;
            }

        }
        //return success to frontend
        echo json_encode(["status" => "success", "data" => $data]);
        exit();
    }





?>
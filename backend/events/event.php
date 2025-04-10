<?php
    require __DIR__ . "/../headers.php";
    require __DIR__ . "/../cookieAuthHeader.php";
    $user = $result->fetch_assoc();
    $login_username = $user["username"];
    $id = $_GET["id"];
    $stmt = $conn->prepare("SELECT * FROM artist_events WHERE id = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        //(title, location, date, description, image_url, creator) VALUES (?, ?, ?, ?, ?, ?)");
        $event = $result->fetch_assoc();
        $title = $event["title"];
        $location = $event["location"];
        $date = $event["date"];
        $description = $event["description"];
        $image = $event["image_url"];
        $creator = $event["creator"];
        $event["status"] = "success";
        
        $data = ["title" => $title, "location" => $location, "description" => $description, "image" => $image, "creator" => $creator, "date" => $date, "participants" => []];
        echo json_encode(["status" => "success", "event" => $data]);
        exit();
    } else {
        echo json_encode(["status" => "error", "message" => "Event not found"]);
        exit();
    }
?>
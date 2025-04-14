<?php 
    require __DIR__ . "/../headers.php";
    require __DIR__ . "/../cookieAuthHeader.php";
    $user = $result->fetch_assoc();
    $login_username = $user["username"];
    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);
    if ($data === null) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid JSON data received'
        ]);
        exit();
    }
$title = $data['title'] ?? ''; // Get title, or empty string if not set
$location = $data['location'] ?? '';
$date = $data['date'] ?? '';
$time = $data['time'] ?? '';
$description = $data['description'] ?? '';
$image = $data['image'] ?? ''; // This will contain the uploaded image filename or empty
$insert_new_event = $conn->prepare("INSERT INTO artist_events (title, location, date, time, description, image_url, creator) VALUES (?, ?, ?, ?, ?, ?, ?)");
$insert_new_event->bind_param("sssssss", $title, $location, $date, $time, $description, $image, $login_username);
$insert_new_event->execute();
$id = $conn->insert_id;
//join own event as default
$stmt = $conn->prepare("INSERT INTO event_participants (username, id) VALUES (?, ?)");
$stmt->bind_param("ss", $login_username, $id);
$stmt->execute();
$stmt->close();
echo json_encode(["status" => "success", "message" => "Event created successfully"]);
exit();
?> 
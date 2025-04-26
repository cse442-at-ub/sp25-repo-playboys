<?php 
    require __DIR__ . "/../headers.php";
    require __DIR__ . "/../cookieAuthHeader.php";
    require __DIR__ . "/../userDatabaseGrabber.php";
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
$requiredFields = ['title', 'location', 'date', 'time', 'description'];
$missingFields = [];

foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        $missingFields[] = $field;
    }
}

if (!empty($missingFields)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing fields: ' . implode(', ', $missingFields)
    ]);
    exit();
}

$minLengths = [
    'title' => 3,
    'location' => 2,
    'description' => 1
];

$maxLengths = [
    'title' => 20,
    'location' => 30,
    'description' => 250
];

$title = $data['title'] ?? ''; // Get title, or empty string if not set
$location = $data['location'] ?? '';
$date = $data['date'] ?? '';
$time = $data['time'] ?? '';
$description = $data['description'] ?? '';
$lengthErrors = [];

foreach ($minLengths as $field => $minLength) {
    if (strlen($data[$field]) < $minLength) {
        $lengthErrors[] = "$field must be at least $minLength characters";
    }
}

foreach ($maxLengths as $field => $maxLength) {
    if (strlen($data[$field]) > $maxLength) {
        $lengthErrors[] = "$field must be no more than $maxLength characters";
    }
}
if(date_checker($date) == false){
    $lengthErrors[] = "The date has already passed. Please choose a future date.";
}
if(fulldatatime_checker($date, $time) == false){
    $lengthErrors[] = "The time has already passed. Please choose a future time.";
}
if (!empty($lengthErrors)) {
    echo json_encode([
        'status' => 'error',
        'message' => $lengthErrors[0]
    ]);
    exit();
}


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
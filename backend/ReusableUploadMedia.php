<?php
require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuthHeader.php";
require __DIR__ . "/config.php"; // assumes $config['frontend_url'] is defined

$uploadDirectory = __DIR__ . "/uploads/";
$response = ['status' => 'error', 'message' => ''];
$frontend_url  = $config['frontend_url'];


// Create directory if not exists
if (!is_dir($uploadDirectory)) {
    mkdir($uploadDirectory, 7777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $image = $_FILES['image'];
    $fileExt = strtolower(pathinfo($image['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'gif'];

    if (!in_array($fileExt, $allowed)) {
        $response['message'] = 'Invalid image type.';
        echo json_encode($response);
        exit;
    }

    $newFileName = uniqid('', true) . '.' . $fileExt;
    $fullPath = $uploadDirectory . $newFileName;
    $relativePath = $frontend_url . "backend/uploads/" . $newFileName;

    if (move_uploaded_file($image['tmp_name'], $fullPath)) {
        $response['status'] = 'success';
        $response['filePath'] = $relativePath;
    } else {
        $response['message'] = 'Failed to save image.';
    }
} else {
    $response['message'] = 'No image file received.';
}

echo json_encode($response, JSON_UNESCAPED_SLASHES);
exit;
?>

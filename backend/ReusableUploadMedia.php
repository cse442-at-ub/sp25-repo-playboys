<?php
require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuthHeader.php";
require __DIR__ . "/config.php"; // assumes $config['frontend_url'] is defined

$config = include("config.php");
$frontend_url = $config['frontend_url'];
$uploadDirectory = __DIR__ . "/useruploads/";
$response = ['status' => 'error', 'message' => ''];

// Ensure upload directory exists and is writable
if (!is_dir($uploadDirectory)) {
    mkdir($uploadDirectory, 0777, true);  // FIXED permission
}
if (!is_writable($uploadDirectory)) {
    $response['message'] = 'Upload directory is not writable.';
    echo json_encode($response);
    exit;
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
    $relativePath = $frontend_url . "backend/useruploads/" . $newFileName;

    if (!file_exists($uploadDirectory)) {
        $response['message'] = 'Directory does not exist: ' . $uploadDirectory;
        echo json_encode($response);
        exit;
    }
    
    if (!is_writable($uploadDirectory)) {
        $response['message'] = 'Directory is not writable: ' . $uploadDirectory;
        echo json_encode($response);
        exit;
    }
    
    if (!is_uploaded_file($image['tmp_name'])) {
        $response['message'] = 'The uploaded image is not supported please use another image';
        echo json_encode($response);
        exit;
    }
    

    if (move_uploaded_file($image['tmp_name'], $fullPath)) {
        $response['status'] = 'success';
        $response['filePath'] = $relativePath;
    } else {
        $response['message'] = 'Failed to save image.';
        error_log("move_uploaded_file failed for " . $fullPath);
        error_log("Upload error details: " . print_r($image, true));
    }
} else {
    $response['message'] = 'No image file received.';
}

echo json_encode($response, JSON_UNESCAPED_SLASHES);
exit;
?>

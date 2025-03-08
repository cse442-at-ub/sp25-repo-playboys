<?php
    require __DIR__ . "/headers.php";
    require __DIR__ . "/cookieAuthHeader.php";


    $uploadDirectory = __DIR__ . "/profilePic/";

    if (!is_dir($uploadDirectory)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to create upload directory.'
        ]);
        }
    $user = $result->fetch_assoc();
    $username = $user["username"];
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Handle profile image
    
        if (isset($_FILES['profileImage'])) {
            $image = $_FILES['profileImage'];
            $fileName = $image['name'];
            $fileTmpName = $image['tmp_name'];
            $fileSize = $image['size'];
            $fileError = $image['error'];
            $fileType = $image['type'];



            $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            $newFileName = uniqid('', true) . '.' . $fileExt;
            if (!is_dir($uploadDirectory)) {
                echo json_encode(["status" => "error", "message" => "Directory doesn't exist"]);
            }
            $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];

            if (in_array($fileExt, $allowedTypes)) {
                $fullPath = $uploadDirectory . $newFileName;
                if (move_uploaded_file($fileTmpName, $fullPath)) {
                    $stmt = $conn->prepare("UPDATE user_profiles SET profile_pic = ? WHERE username = ?");
                    $relativePath = "." . "/backend/profilePic/" . $newFileName;
                    $stmt->bind_param("ss", $relativePath, $username);
                    $stmt->execute();
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Profile image uploaded successfully!',
                        'fileName' => $relativePath // Optionally return the new file name for future use
                    ]);
                }else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Error moving the uploaded file.'
                    ]);
                }
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid file type. Only JPG, PNG, and GIF are allowed.'
                ]);
            }
            // Process the image
        }else {
            echo json_encode([
                'status' => 'error',
                'message' => 'No file uploaded or file upload error.'
            ]);
        }
    }
?>
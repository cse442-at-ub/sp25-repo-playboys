    <?php
        require __DIR__ . "/headers.php";
        require __DIR__ . "/cookieAuthHeader.php";

        $uploadDirectory = __DIR__ . "/posts/";
        $response = ['status' => 'error', 'message' => ''];

        // Create directory if it doesn't exist
        if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 2777, true)) {
            $response['message'] = 'Failed to create upload directory.';
            echo json_encode($response);
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Get form data
            $title = $_POST['title'] ?? '';
            $description = $_POST['description'] ?? '';
            $song_name = $_POST['song'] ?? '';

            // Validate required fields
            if (empty($title) || empty($description) || empty($song_name) || !isset($_FILES['media'])) {
                $response['message'] = 'All fields are required!';
                echo json_encode($response);
                exit;
            }

            // Process file upload
            $media = $_FILES['media'];
            $fileExt = strtolower(pathinfo($media['name'], PATHINFO_EXTENSION));
            $newFileName = uniqid('', true) . '.' . $fileExt;
            $fullPath = $uploadDirectory . $newFileName;
            $relativePath = "backend/posts/" . $newFileName; // Adjust this path according to your server setup

            $allowedTypes = [
                'image' => ['jpg', 'jpeg', 'png', 'gif']
            ];

            // Determine media type
            $media_type = 'unknown';
            if (in_array($fileExt, $allowedTypes['image'])) {
                $media_type = 'image';
            } elseif (in_array($fileExt, $allowedTypes['video'])) {
                $media_type = 'video';
            }

            // Validate file type
            if ($media_type === 'unknown') {
                $response['message'] = 'Invalid file type. Allowed types: ' . implode(', ', array_merge(...array_values($allowedTypes)));
                echo json_encode($response);
                exit;
            }

            // Validate file size (50MB max)
            $maxSize = 50 * 1024 * 1024;
            if ($media['size'] > $maxSize) {
                $response['message'] = 'File too large. Maximum size is 50MB.';
                echo json_encode($response);
                exit;
            }

            // get username $auth_token = $_COOKIE["auth_token"];
            $stmt_cookie = $conn->prepare("SELECT username FROM cookie_authentication WHERE auth_key = ?");
            $stmt_cookie->bind_param("s", $auth_token);
            $stmt_cookie->execute();
            $result = $stmt_cookie->get_result();
            $user = $result->fetch_assoc();
            $username = $user["username"];


            // Move uploaded file
            if (move_uploaded_file($media['tmp_name'], $fullPath)) {
                // Insert into database
                $stmt = $conn->prepare("INSERT INTO posts
                    (username, title, description, song_name, media_path, media_type)
                    VALUES (?, ?, ?, ?, ?, ?)");

                $stmt->bind_param("ssssss",
                    $username,
                    $title,
                    $description,
                    $song_name,
                    $relativePath,
                    $media_type);

                if ($stmt->execute()) {
                    $response['status'] = 'success';
                    $response['message'] = 'Post created successfully!';
                    $response['filePath'] = $relativePath;
                } else {
                    $response['message'] = 'Database error: ' . $stmt->error;
                }
            } else {
                $response['message'] = 'Failed to move uploaded file.';
            }
        }

        echo json_encode($response);
        exit;
    ?>
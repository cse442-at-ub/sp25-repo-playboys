<?php

// create function to  create a community

function createCommunity($conn, $community, $picture) {
    if (communityExists($conn, $community)) {
        return ["status" => "error", "message" => "Community already exists"];
    }
    try {
        $members = json_encode([]); // Store as an empty JSON array instead of ""
        
        $stmt = $conn->prepare("
            INSERT INTO communities (community_name, picture, members) 
            VALUES (?, ?, ?)"
        );
        $stmt->bind_param("sss", $community, $picture, $members);

        if ($stmt->execute()) {
            return ["status" => "success", "message" => "Community created successfully", "community_id" => $conn->insert_id];
        } else {
            return ["status" => "error", "message" => "Failed to create community"];
        }

    } catch (Exception $e) {
        return ["status" => "error", "message" => "Error: " . $e->getMessage()];
    }
}

// create a function to test if a community exists returns true or false
function communityExists($conn, $community) {
    $stmt = $conn->prepare("SELECT 1 FROM communities WHERE community_name = ? LIMIT 1");
    $stmt->bind_param("s", $community);
    $stmt->execute();
    $stmt->store_result();    
    return $stmt->num_rows > 0; // Returns true if a row exists, false otherwise
}

function userInCommunity($conn, $community, $user){
    // Check if the community exists
    if (!communityExists($conn, $community)) {
        return ["status" => "error", "message" => "Community does not exist"];
    }

    // Prepare the SQL query to get the community data
    $stmt = $conn->prepare("SELECT community_name, picture, members FROM communities WHERE community_name = ? LIMIT 1");
    $stmt->bind_param("s", $community);
    $stmt->execute();
    $stmt->store_result();

    // Bind the result to variables
    $stmt->bind_result($community_name, $picture, $members);
    $stmt->fetch(); // Fetch the result

    $members = json_decode($members, true); // Decode the members if it's a JSON array
    if (in_array($user, $members)) {
        return TRUE;
    }
    return FALSE;
}


// Create a function to add a user to a community
function addUser($conn, $community, $user) {
    // Prepare the SQL query to get the community data
    $stmt = $conn->prepare("SELECT community_name, picture, members FROM communities WHERE community_name = ? LIMIT 1");
    $stmt->bind_param("s", $community);
    $stmt->execute();
    $stmt->store_result();

    // Bind the result to variables
    $stmt->bind_result($community_name, $picture, $members);
    $stmt->fetch(); // Fetch the result

    $members = json_decode($members, true); // Decode the members if it's a JSON array

    array_push($members, $user); // Add the user to the members array
    $members = json_encode($members); // Encode the members array back to JSON

    $stmt = $conn->prepare("UPDATE communities SET members = ? WHERE community_name = ?");
    $stmt->bind_param("ss", $members, $community_name);
    $stmt->execute();

    // Return the community data in the response
    return [
        "status" => "success",
        "message" => "Added user from community",
        "community" => [
            "community_name" => $community_name,
            "picture" => $picture,
            "members" => json_decode($members) // Decoding the members if it's a JSON array
        ]
    ];
}


// create a remove to add a user to a community
function removeUser($conn, $community, $user) {
    // Prepare the SQL query to get the community data
    $stmt = $conn->prepare("SELECT community_name, picture, members FROM communities WHERE community_name = ? LIMIT 1");
    $stmt->bind_param("s", $community);
    $stmt->execute();
    $stmt->store_result();

    // Bind the result to variables
    $stmt->bind_result($community_name, $picture, $members);
    $stmt->fetch(); // Fetch the result

    $members = json_decode($members, true); // Decode the members if it's a JSON array

    $index = array_search($user, $members);
    unset($members[$index]);
    $members = json_encode($members); // Encode the members array back to JSON

    $stmt = $conn->prepare("UPDATE communities SET members = ? WHERE community_name = ?");
    $stmt->bind_param("ss", $members, $community_name);
    $stmt->execute();

    // Return the community data in the response
    return [
        "status" => "success",
        "message" => "Removed user from community",
        "community" => [
            "community_name" => $community_name,
            "picture" => $picture,
            "members" => json_decode($members) // Decoding the members if it's a JSON array
        ]
    ];
}

// create a function to add the comunity to the users profile
function addCommunity($conn, $community, $user) {
    $stmt = $conn->prepare("SELECT Communities FROM user_profiles WHERE username = ? LIMIT 1");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $stmt->store_result();

    // Bind the result to variables
    $stmt->bind_result($Communities);
    $stmt->fetch(); // Fetch the result

    $Communities = json_decode($Communities, true); // Decode the members if it's a JSON array
    array_push($Communities, $community); // Add the user to the members array
    $Communities = json_encode($Communities); // Encode the members array back to JSON

    $stmt = $conn->prepare("UPDATE user_profiles SET Communities = ? WHERE username = ?");
    $stmt->bind_param("ss", $Communities, $user);
    $stmt->execute();

    // Return the community data in the response
    return [
        "status" => "success",
        "message" => "Added community to user profile",
    ];
}

function removeCommunity($conn, $community, $user) {
    // Prepare the SQL query to get the community data
    $stmt = $conn->prepare("SELECT Communities FROM user_profiles WHERE username = ? LIMIT 1");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $stmt->store_result();

    // Bind the result to variables
    $stmt->bind_result($Communities);
    $stmt->fetch(); // Fetch the result

    $Communities = json_decode($Communities, true); // Decode the members if it's a JSON array


    $index = array_search($community, $Communities);
    unset($Communities[$index]);
    $Communities = array_values($Communities);
    $Communities = json_encode($Communities); // Encode the members array back to JSON

    $stmt = $conn->prepare("UPDATE user_profiles SET Communities = ? WHERE username = ?");
    $stmt->bind_param("ss", $Communities, $user);
    $stmt->execute();

    // Return the community data in the response
    return [
        "status" => "success",
        "message" => "Removed community from user profile",
    ];
}

function getCommunties($conn, $user){
    $stmt = $conn->prepare("SELECT Communities FROM user_profiles WHERE username = ? LIMIT 1");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $stmt->store_result();
    
    $stmt->bind_result($Communities);
    $stmt->fetch(); // Fetch the result

    $Communities = json_decode($Communities, true); // Decode the members if it's a JSON array
    return $Communities;
}

function getAllCommunities($conn) {
    $stmt = $conn->prepare("SELECT community_name, picture, members FROM communities");
    $stmt->execute();
    $stmt->store_result();

    // Bind the result to variables
    $stmt->bind_result($community_name, $picture, $members);
    
    $communities = [];

    while ($stmt->fetch()) { // Fetch all results
        $members = json_decode($members, true); // Decode the members if it's a JSON array
        $communities[] = [
            "community_name" => $community_name,
            "picture" => $picture,
            "members" => $members
        ];
    }

    return $communities;
}


?>
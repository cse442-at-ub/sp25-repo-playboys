import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCSRFToken } from '../csrfContent';
import "./CreateCommunityPage.css";

const CreateCommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const { csrfToken } = useCSRFToken();

  const [communityName, setCommunityName] = useState("");
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBackgroundFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();
    if (backgroundFile) {
      formData.append('image', backgroundFile);
    }

    const uploadRes = await fetch(`${process.env.REACT_APP_API_URL}backend/ReusableUploadMedia.php`, {
      method: 'POST',
      body: formData,
      headers: {
        'CSRF-Token': csrfToken,
      },
      credentials: 'include',
    });

    const uploadResult = await uploadRes.json();
    if (uploadResult.status === 'success') {
      return uploadResult.filePath; // Assuming the response contains the image path
    } else {
      console.error("Image upload failed:", uploadResult);
      return "error"; // Handle error appropriately
    }
  }

  const verifyUserSession = async () => {
    const profileRes = await fetch(`${process.env.REACT_APP_API_URL}backend/getProfile.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      credentials: 'include',
    });
    const profileData = await profileRes.json();
    if (profileData.status !== 'success') {
      return "error";
    }
    return profileData.loggedInUser;
  }

  const createCommunity = async (name: string, imagePath: string) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/create_comunity.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({ "name":name, "image":imagePath }),
    });

    const result = await res.json();
    if (result.status === 'success') {
      return(true);
    } else {
      console.error(result.message);
    }
  }

  const adduserToCommunity = async (user: string, communityName: string) => {
    var response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/join_community.php`, {
      method: 'POST', // Or 'GET' depending on your API
      headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken
      },
      body: JSON.stringify({
          "name": communityName,
          "user": user
      })
  });
  var results = await response.json();
  console.log(results)
  
  // add community to user profile
  console.log("adding community to profile");
  var response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/addcomtopfp.php`, {
      method: 'POST', // Or 'GET' depending on your API
      headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken
      },
      body: JSON.stringify({
          "name": communityName,
          "user": user
      })
  });
  var results = await response.json();
  console.log(results);
  return true;
}

  

    


  const handleCreate = async () => {
    const user = await verifyUserSession();
    if (user === "error") {
      console.error("User not logged in");
      return;
    }
    const imagePath = await uploadImage();
    if (imagePath === "error") {
      console.error("Image upload failed");
      return;
    }
    const success = await createCommunity(communityName, imagePath);
    if (!success) {
      console.error("Community creation failed");
      return;
    }
    const addSuccess = await adduserToCommunity(user, communityName);
    if (!addSuccess) {
      console.error("Failed to add user to community");
      return;
    }
    navigate("/userprofile"); // Redirect to communities page after creation   
  };

  return (
    <div className="create-community-page">
      <button className="back-button" onClick={() => navigate(-1)}>←</button>

      <h2>Create a New Community</h2>

      <div
        className="upload-area"
        onClick={() => document.getElementById("bg-upload")?.click()}
      >
        <img
          src={
            previewImage || process.env.PUBLIC_URL + '/static/UploadBackgroundPlaceholder.png'
          }
          alt="Background Preview"
          className="upload-preview"
        />
        <input
          type="file"
          id="bg-upload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
        <p>Click to upload a background image</p>
      </div>

      <input
        className="community-name-input"
        type="text"
        value={communityName}
        onChange={(e) => setCommunityName(e.target.value)}
        placeholder="Enter Community Name"
        maxLength={50}
      />

      <div className="create-community-buttons">
        <button className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
        <button
          className="create-btn"
          disabled={!communityName || !backgroundFile}
          onClick={handleCreate}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateCommunityPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCSRFToken } from '../csrfContent';
import "./CreateCommunityPage.css";

const CreateCommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [communityName, setCommunityName] = useState("");
  const { csrfToken } = useCSRFToken();
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}backend/getProfile.php`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json", "CSRF-Token": csrfToken },
        });

        const data = await res.json();
        if (data.status === "success") {
          setLoggedInUser(data.loggedInUser);
        }
      } catch (err) {
        console.error("Failed to fetch logged-in user:", err);
      }
    };

    fetchLoggedInUser();
  }, []);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCreate = async () => {
    if (!communityName || !loggedInUser) {
      alert("Missing community name or user.");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}backend/custom_communities/createCommunity.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "CSRF-Token": csrfToken },
        credentials: "include",
        body: JSON.stringify({
          community_name: communityName,
          background_image: backgroundImage || "",
          user_id: loggedInUser
        })
      });
  
      const result = await response.json();
      if (result.status === "success") {
        alert("Community created!");
        navigate("/userprofile");
      } else {
        alert(result.message || "Failed to create community.");
      }
    } catch (err) {
      console.error("Error creating community:", err);
      alert("Network error while creating community.");
    }
  };
  
  

  return (
    <div className="create-community-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ←
      </button>

      <div className="upload-area" onClick={() => document.getElementById("bg-upload")?.click()}>
        <img
          src={
            backgroundImage || process.env.PUBLIC_URL + '/static/UploadBackgroundPlaceholder.png'
          }
          alt="Background"
          className="upload-preview"
        />
        <input
          type="file"
          id="bg-upload"
          style={{ display: "none" }}
          accept="image/*"
          placeholder="Click to add Background Image"
          onChange={handleImageUpload}
        />
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
        <button className="create-btn" onClick={handleCreate}>Create</button>
      </div>
    </div>
  );
};

export default CreateCommunityPage;

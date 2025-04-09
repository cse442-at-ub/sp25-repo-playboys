import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateCommunityPage.css";
import Sidebar from "../user_profile/Sidebar";

const CreateCommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [communityName, setCommunityName] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCreate = () => {
    // send data to backend here in the future
    console.log("Creating community:", { communityName, backgroundImage });
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
      <div className="side-column">
        <Sidebar />
      </div>
    </div>
  );
};

export default CreateCommunityPage;

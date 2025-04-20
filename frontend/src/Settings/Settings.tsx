import React from "react";
import "./Settings.css"; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import MainContent from "../MainContent";
import Sidebar from "../user_profile/Sidebar";
const options = [
  { name: "Account", imageUrl: "./static/AccountIcon.png" },
  { name: "Privacy", imageUrl: "./static/LockIcon.png" },
  { name: "Notifications", imageUrl: "./static/BellIcon.png" },
  { name: "Playback & Data", imageUrl: "./static/RewindIcon.png" },
  { name: "Community & Social", imageUrl: "./static/CommunityIcon.png" },
  { name: "App & Support", imageUrl: "./static/ClogIcon.png" },
];

const Settings = () => {
  const navigate = useNavigate();
  const handleBackButton = () => {
    console.log("Show all clicked");
    navigate("/userprofile");
    //navigate('/userProfile');
  };
  return (
    <MainContent>
            <Sidebar />
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <div className="header-text">
          <button className="btn btn-light btn-lg fs-3 p-10" aria-label="Go back" onClick={handleBackButton}>←</button>
            <span>Settings</span>
          </div>
        </div>

        <div className="option-container">
          {options.map((option, index) => (
            <button className="option-button"onClick={() => window.location.href = `#/settings/${option.name.split(" ")[0].toLowerCase()}`}>
              <div key={index} className="option-card">
                <img 
                src = {option.imageUrl} 
                alt = {option.name}/>
                <p>{option.name}</p>
              </div>
          </button>
            
          ))}
        </div>
      </div>
    </div>
    </MainContent>
  );
};

export default Settings;

import React from "react";
import "./Settings.css"; // Import the CSS file

const options = [
  { name: "Account", imageUrl: "./static/AccountIcon.png" },
  { name: "Privacy", imageUrl: "./static/LockIcon.png" },
  { name: "Notifications", imageUrl: "./static/BellIcon.png" },
  { name: "Playback & Data", imageUrl: "./static/RewindIcon.png" },
  { name: "Community & Social", imageUrl: "./static/CommunityIcon.png" },
  { name: "App & Support", imageUrl: "./static/ClogIcon.png" },
];

const Settings = () => {
  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <div className="header-text">
            <span className="menu-icon">☰</span>
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
  );
};

export default Settings;

import React from "react";
import "./Settings.css"; // Import the CSS file

const options = [
  { name: "Account", icon: "👤" },
  { name: "Privacy & Security", icon: "🔒" },
  { name: "Notifications", icon: "🔔" },
  { name: "Playback & Data", icon: "⏮️" },
  { name: "Community & Social", icon: "👥" },
  { name: "App & Support", icon: "🎧" },
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
                <div className="icon">{option.icon}</div>
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

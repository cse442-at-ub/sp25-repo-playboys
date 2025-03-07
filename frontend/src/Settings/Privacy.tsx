import React from "react";
import "./Settings.css";
import { useNavigate } from 'react-router-dom';

const options = [
    { name: "Profile Visibility", icon: "./static/AccountIcon.png", path: "settings/privacy/profile_visibility" },
    { name: "Listening History", icon: "./static/HistoryIcon.png", path: "settings/privacy/listening_history" },
    { name: "Blocked Users", icon: "./static/BlockIcon.png", path: "settings/privacy/blocked_users" },
    { name: "Two-Factor Authentication", icon: "./static/SecureIcon.png", path: "settings/privacy/two_factor_auth" },
    { name: "Active Sessions", icon: "./static/PhoneIcon.png", path: "settings/privacy/active_sessions" }
];

const SettingsPrivacy = () => {

  const navigate = useNavigate();
  const handleBackButton = () => {
    console.log("Show all clicked");
    navigate("/settings");
    //navigate('/userProfile');
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <div className="header-text">
                    <button className="btn btn-light btn-lg fs-3 p-10" aria-label="Go back" onClick={handleBackButton}>←</button>
                    <span>Privacy</span>
                  </div>
        </div>

        <div className="option-container">
          {options.map((option, index) => (
            <button className="option-button"onClick={() => window.location.href = `#/${option.path}`}>
                <div key={index} className="option-card">
                  <img src = {option.icon} alt = {option.name} />
                  <p>{option.name}</p>
                </div>
              </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPrivacy;

import React from "react";
import { href } from "react-router-dom";
import "./MobileSettings.css";
import { useNavigate } from 'react-router-dom';
import path from "path";
const options = [
  { name: "Update Profile", icon: "./static/ProfileIcon.png", path: "settings/account/update_profile" },
  { name: "Update Email", icon: "./static/EmailIcon.png", path: "settings/account/update_email" },
  { name: "Update Password", icon: "./static/KeyIcon.png", path: "settings/account/update_password" },
  { name: "Linked Accounts", icon: "./static/LinkIcon.png", path: "settings/account/linked_accounts" },
  { name: "Log Out", icon: "./static/LogoutIcon.png", path: "settings/app_support/logout" },
  { name: "Delete Account", icon: "./static/DeleteIcon.png", path: "settings/account/delete_account" }
];

const MobileSettingsAccount = () => {

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
            <span>Account</span>
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

export default MobileSettingsAccount;

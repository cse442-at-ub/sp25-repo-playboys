import React from "react";
import { useNavigate } from 'react-router-dom';
import "./Settings.css";

const options = [
  { name: "Update Profile", icon: "./static/ProfileIcon.png", path: "settings/account" }, //"settings/account/update_profile" 
  { name: "Update Email", icon: "./static/EmailIcon.png", path: "settings/account" }, //"settings/account/update_email" 
  { name: "Update Password", icon: "./static/KeyIcon.png", path: "settings/account" }, //"settings/account/update_password"
  { name: "Linked Accounts", icon: "./static/LinkIcon.png", path: "settings/account" }, // "settings/account/linked_accounts"
  { name: "Log Out", icon: "./static/LogoutIcon.png", path: "logout" },
  { name: "Delete Account", icon: "./static/DeleteIcon.png", path: "settings/account/delete_account" }
];

const SettingsAccount = () => {

  const navigate = useNavigate();

  const handleBackButton = () => {
    console.log("Go back clicked");
    navigate("/settings");
  };

  const handleOptionClick = async (selectedPath: string) => {
    if (selectedPath === "logout") {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/logout.php`, { 
          method: "POST", 
          credentials: "include", 
          headers: { "Content-Type": "application/json" } 
        });

        const data = await response.json(); // Parse JSON response

        if (data.status === "success") {
          // Clear the authentication cookie
          document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          // Redirect to login page
          window.location.href = "#/login";
        } else {
          // If there's an error logging out, just redirect to login
          document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.href = "#/login";
        }
      } catch (error) {
        console.error("Error logging out:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      window.location.href = `#/${selectedPath}`;
    }
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
            <button
              key={index}
              className="option-button"
              onClick={() => handleOptionClick(option.path)} // Using the handleOptionClick function
            >
              <div className="option-card">
                <img src={option.icon} alt={option.name} />
                <p>{option.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsAccount;


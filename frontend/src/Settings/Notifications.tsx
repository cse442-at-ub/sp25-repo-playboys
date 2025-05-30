import React from "react";
import "./Settings.css";
import { useNavigate } from 'react-router-dom';
import MainContent from "../MainContent";
import Sidebar from "../user_profile/Sidebar";

const options = [
  { name: "Do Not Disturb", icon: "./static/SilenceIcon.png", path: "settings/app_support/report_problem" },
  { name: "Snooze", icon: "./static/SnoozeIcon.png", path: "settings/app_support/report_problem" },
  { name: "Delivery Method", icon: "./static/DeliveryIcon.png", path: "settings/app_support/report_problem" },
  
];


const SettingsNotifications = () => {

  const navigate = useNavigate();
  const handleBackButton = () => {
    console.log("Show all clicked");
    navigate("/settings");
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
              <span>Notification</span>
            </div>
        </div>

        <div className="option-container">
          {options.map((option, index) => (
            <button className="option-button"onClick={() => window.location.href = `#/${option.path}`}>
                <div key={index} className="option-card">
                  <img src = {option.icon} alt = {option.icon} />
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

export default SettingsNotifications;

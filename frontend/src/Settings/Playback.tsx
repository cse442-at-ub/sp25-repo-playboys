import React from "react";
import "./Settings.css";
import { useNavigate } from 'react-router-dom';
import MainContent from "../MainContent";
import Sidebar from "../user_profile/Sidebar";

const options = [
    { name: "Music Source", icon: "./static/MusicIcon.png", path: "settings/playback" },
    { name: "Auto-Scrobble", icon: "./static/AutoScrobbleIcon.png", path: "settings/playback" },
    { name: "Playback Quality", icon: "./static/AudioIcon.png", path: "settings/playback"},
  ];
  

const SettingsPlayback = () => {

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
              <span>Playback</span>
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
    </MainContent>
  );
};

export default SettingsPlayback;

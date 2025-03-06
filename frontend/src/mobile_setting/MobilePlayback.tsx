import React from "react";
import "./MobileSettings";
import { useNavigate } from 'react-router-dom';

const options = [
    { name: "Music Source", icon: "./static/MusicIcon.png", path: "settings/playback/default_music_source" },
    { name: "Auto-Scrobble", icon: "./static/AutoScrobbleIcon.png", path: "settings/playback/auto_scrobble" },
    { name: "Playback Quality", icon: "./static/AudioIcon.png", path: "settings/playback/playback_quality" },
  ];
  

const MobileSettingsPlayback = () => {

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
  );
};

export default MobileSettingsPlayback;

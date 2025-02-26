import React from "react";
import "./Settings.css";

const options = [
    { name: "Default Music Source", icon: "🎵", path: "/settings/playback/default_music_source" },
    { name: "Auto-Scrobble", icon: "🔄", path: "/settings/playback/auto_scrobble" },
    { name: "Offline Data Storage", icon: "💾", path: "/settings/playback/offline_data_storage" },
    { name: "Playback Quality", icon: "🎚️", path: "/settings/playback/playback_quality" },
    { name: "Data Sync Frequency", icon: "🔁", path: "/settings/playback/data_sync_frequency" }
  ];
  

const SettingsPlayback = () => {
  return (
    <div className="container">
      <div className="header">
        <div className="header-text">
                  <span className="menu-icon">☰</span>
                  <span>Settings-Account</span>
                </div>
                <button className="back-button" onClick={() => window.location.href = "/settings"}>
                  🔙
                </button>
      </div>

      <div className="option-container">
        {options.map((option, index) => (
          <button className="option-button"onClick={() => window.location.href = `${option.path}`}>
                      <div key={index} className="option-card">
                        <div className="icon">{option.icon}</div>
                        <p>{option.name}</p>
                      </div>
                    </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsPlayback;

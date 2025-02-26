import React from "react";
import "./Settings.css";

const options = [
    { name: "Profile Visibility", icon: "👤", path: "/settings/privacy/profile_visibility" },
    { name: "Listening History", icon: "🎵", path: "/settings/privacy/listening_history" },
    { name: "Blocked Users", icon: "🚫", path: "/settings/privacy/blocked_users" },
    { name: "Two-Factor Authentication", icon: "🔑", path: "/settings/privacy/two_factor_auth" },
    { name: "Active Sessions", icon: "📱", path: "/settings/privacy/active_sessions" }
];

const SettingsPrivacy = () => {
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

export default SettingsPrivacy;

import React from "react";
import "./Settings.css";
const options = [
  { name: "Theme & Appearance", icon: "🎨", path: "/settings/app_support/theme_appearance" },
  { name: "Language", icon: "🌍", path: "/settings/app_support/language" },
  { name: "Help Center", icon: "❓", path: "/settings/app_support/help_center" },
  { name: "Report a Problem", icon: "⚠️", path: "/settings/app_support/report_problem" },
  { name: "Log Out", icon: "🚪", path: "/settings/app_support/logout" }
];


const SettingsNotifications = () => {
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

export default SettingsNotifications;

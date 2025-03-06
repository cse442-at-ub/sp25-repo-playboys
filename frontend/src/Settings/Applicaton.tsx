import React from "react";
import "./Settings.css";

const options = [
  { name: "Theme & Appearance", icon: "🎨", path: "settings/app_support/theme_appearance" },
  { name: "Language", icon: "🌍", path: "settings/app_support/language" },
  { name: "Help Center", icon: "❓", path: "settings/app_support/help_center" },
  { name: "Report a Problem", icon: "⚠️", path: "settings/app_support/report_problem" },
  { name: "Log Out", icon: "🚪", path: "logout" } // "logout" to trigger API call
];

const SettingsApplication = () => {
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
          document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.href = "#/login"; // Redirect to login
        } else {
   
          document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.href = "#/login"; // Redirect to login
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
            <span className="menu-icon">☰</span>
            <span>Settings-Account</span>
          </div>
          <button className="back-button" onClick={() => window.location.href = "#/settings"}>
            🔙
          </button>
        </div>

        <div className="option-container">
          {options.map((option, index) => (
            <button
              key={index}
              className="option-button"
              onClick={() => handleOptionClick(option.path)}
            >
              <div className="option-card">
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

export default SettingsApplication;
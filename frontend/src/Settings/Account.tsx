import React from "react";
import { href } from "react-router-dom";
import "./Settings.css";
import path from "path";
const options = [
  { name: "Update Profile", icon: "👤", path: "settings/account/update_profile" },
  { name: "Update Email", icon: "📧", path: "settings/account/update_email" },
  { name: "Update Password", icon: "🔑", path: "settings/account/update_password" },
  { name: "Linked Accounts", icon: "🔗", path: "settings/account/linked_accounts" },
  { name: "Delete Account", icon: "🗑️", path: "settings/account/delete_account" }
];

const SettingsAccount = () => {
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
            <button className="option-button"onClick={() => window.location.href = `#/${option.path}`}>
              <div key={index} className="option-card">
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

export default SettingsAccount;

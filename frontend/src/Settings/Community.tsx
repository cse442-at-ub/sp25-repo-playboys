import React from "react";
import "./Settings.css";

const options = [
  { name: "Friend Requests", icon: "🤝", path: "/settings/community/friend_requests" },
  { name: "Activity Sharing", icon: "📢", path: "/settings/community/activity_sharing" },
  { name: "Collaborative Playlists", icon: "🎶", path: "/settings/community/collaborative_playlists" },
  { name: "Private Messages", icon: "💬", path: "/settings/community/private_messages" },
  { name: "Mute Conversations", icon: "🔇", path: "/settings/community/mute_conversations" }
];


const SettingsComunity = () => {
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

export default SettingsComunity;
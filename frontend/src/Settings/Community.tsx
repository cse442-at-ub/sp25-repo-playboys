import React from "react";
import "./Settings.css";
import { useNavigate } from 'react-router-dom';

const options = [
  { name: "Friend Requests", icon: "./static/FriendRequest.png", path: "settings/community/friend_requests" },
  { name: "Activity Sharing", icon: "./static/ActivitySharingIcon.png", path: "settings/community/activity_sharing" },
  { name: "Collaborative Playlists", icon: "./static/PlaylistCollabIcon.png", path: "settings/community/collaborative_playlists" },
  { name: "Private Messages", icon: "./static/PrivateMessageIcon.png", path: "settings/community/private_messages" },
  { name: "Mute Conversations", icon: "./static/MuteConIcon.png", path: "settings/community/mute_conversations" }
];


const SettingsComunity = () => {

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
              <span>Community & Social</span>
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

export default SettingsComunity;
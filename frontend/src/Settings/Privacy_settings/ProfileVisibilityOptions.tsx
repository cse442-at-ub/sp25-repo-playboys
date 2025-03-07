import React, { useState } from "react";
import "./ProfileVisibility.css"; // Custom CSS file for extra styling
import { useNavigate } from 'react-router-dom';

const ProfileVisibility: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("No One");

  const options = ["Everyone", "Friends Only", "No One"];

    const navigate = useNavigate();
    const handleBackButton = () => {
      console.log("Show all clicked");
      navigate("/settings/privacy");
      //navigate('/userProfile');
    };

  return (
    
    <div className="profile-visibility-container d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="settings-header">
                <div className="settings-header-text">
                    <button className="btn btn-light btn-lg fs-3 p-10" aria-label="Go back" onClick={handleBackButton}>←</button>
                    <span>Profile Visibility</span>
                </div>
            </div>
      <div className="visibility-box p-4 rounded shadow-lg text-center">
        <h2 className="fs-5 mb-4">Who Can View Your Profile</h2>

        <div className="d-flex flex-column gap-3">
          {options.map((option) => (
            <button
              key={option}
              className={`btn visibility-option ${
                selectedOption === option ? "selected" : ""
              }`}
              onClick={() => setSelectedOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileVisibility;

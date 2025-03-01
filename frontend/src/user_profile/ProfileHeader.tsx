import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileHeader() {
  // Define variables for friends, followers, and following
  const friendsCount = 1000;
  const followersCount = 10;
  const followingCount = "∞";
  const userName = "John Doe";
  const userTag = "john_doe";

  const navigate = useNavigate();
  const handleEditProfile = () => {
    console.log("Show all clicked");
    navigate('/edit-profile')
    };

  return (
    <div className="row">
      <div className="col-md-4">
        <img
          src="./static/ProfilePlaceholder.png"
          alt="Profile picture"
          className="img-fluid rounded-circle mt-3"
        />
      </div>
      <div className="col-md-8">
        <div className="d-flex flex-column align-items-start font-weight-bold text-dark">
          <h1 className="display-4" style={{ fontSize: "4rem", fontWeight: "bold" }}> {userName}</h1>
          <h2 className="mt-3" style={{ fontSize: "2rem" }}>@{userTag}</h2>
          <p className="h4 mt-3">
            {friendsCount} <span>Friends </span>
            {followersCount} <span>Followers </span>
            {followingCount} <span>Following</span>
          </p>
          <button className="btn btn-secondary btn-lg mt-4 px-5" onClick={handleEditProfile}>
            🖋️ Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;


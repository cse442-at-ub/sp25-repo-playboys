import React from 'react';

function ProfileHeader() {
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
          <h2 className="text-decoration-underline">Your Profile</h2>
          <h1 className="display-4">John Doe</h1>
          <h2 className="mt-3">@john_doe</h2>
          <p className="h4 mt-3">
            9999 <span>Friends </span>10<span> followers </span>∞
            <span> following</span>
          </p>
          <button className="btn btn-secondary btn-lg mt-4 px-5">
            🖋️ Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
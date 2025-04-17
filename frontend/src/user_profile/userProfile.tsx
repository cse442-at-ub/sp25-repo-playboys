
import React from 'react';
import ProfileHeader from './ProfileHeader';
import TopArtists from './TopArtists';
import Playlists from './Playlists';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import CommunityResultsProfile from './comunity_profile';
import MainContent from "../MainContent"; // Adjust path if needed



const UserProfile: React.FC = () => {
  return (
    <MainContent>
    <div className="container-fluid bg-white py-3 px-3">
      <div className="row">
        <div className="col-12 col-lg-9" style={{ paddingRight: '0' }}>
          <ProfileHeader />
          <div className="mb-4"><TopArtists /></div>
          <div className="mb-4"><Playlists /></div>
          <div className="mb-4">
          <div className="mb-4">
            {/* Header Row */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="mb-0">My Communities</h2>
              <a
                href="#/create-community"
                className="btn btn-success rounded-circle d-flex justify-content-center align-items-center"
                style={{ width: "40px", height: "40px", fontSize: "24px", lineHeight: "0" }}
              >
                +
              </a>
            </div>

            {/* Community Grid */}
            <CommunityResultsProfile />
          </div>

        </div>

        </div>
        <div className="col-12 col-lg-3" style={{ paddingLeft: '0' }}>
          <Sidebar />
        </div>
      </div>
        <div className = "d-lg-none" style = {{height: "60px"}}/>
    </div>
    </MainContent>
  );
};

export default UserProfile;
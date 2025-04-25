import React from 'react';
import ProfileHeader from './ProfileHeader';
import TopArtists from './TopArtists';
import Playlists from './Playlists';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import CommunityResultsProfile from './comunity_profile';
import MyEvent from './event_profile';
import MainContent from "../MainContent"; // Adjust path if needed

const sectionTitleStyle = {
  fontSize: '1.5rem', // Consistent title size
  fontWeight: 'bold',
  marginBottom: '1rem',
  color: '#343a40', // A slightly darker, professional color
};

const UserProfile: React.FC = () => {
  return (
    <MainContent>
      <div className="container-fluid py-4 px-lg-5"> {/* Removed bg-light */}
        <div className="row">
          <div className="col-12 col-lg-9 pe-lg-4">
            <ProfileHeader />
          </div>
          <div className="col-12 pe-lg-4">

            <div className="pt-4 mb-4"> {/* Added pt-4 for top padding above TopArtists */}
              <TopArtists />
            </div>
            <div className="mb-4">
              <Playlists />
            </div>
            <div className="mb-4">
              <CommunityResultsProfile />
            </div>
            <div className="mb-4">
              <div>
                <MyEvent />
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-3 ps-lg-4">
            <Sidebar />
          </div>
        </div>
        <div className="d-lg-none" style={{ height: "60px" }} />
      </div>
    </MainContent>
  );
};

export default UserProfile;
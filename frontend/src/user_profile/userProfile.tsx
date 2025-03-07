import React from 'react';
import ProfileHeader from './ProfileHeader';
import TopArtists from './TopArtists';
import Playlists from './Playlists';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfile: React.FC = () => {
  return (
    <div className="container-fluid bg-white py-3 px-3">
      <div className="row">
        {/* Main Content (Full-width on mobile, 9 columns on larger screens) */}
        <div className="col-12 col-lg-9">
          <ProfileHeader />
          <div className="mb-4"><TopArtists /></div>
          <div className="mb-4"><Playlists /></div>
        </div>
        
        {/* Sidebar (Moves below content on small screens) */}
        <div className="col-12 col-lg-3 mt-4 mt-lg-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;


import React from 'react';
import ProfileHeader from './ProfileHeader';
import TopArtists from './TopArtists';
import Playlists from './Playlists';
import Sidebar from './Sidebar';
import CommunityResults from '../search_result_page/communityResults';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewProfile: React.FC = () => {
  return (
    <div className="container-fluid bg-white py-3 px-3">
      <div className="row">
        <div className="col-12 col-lg-9" style={{ paddingRight: '0' }}>
          <ProfileHeader />
          <div className="mb-4"><TopArtists /></div>
          <div className="mb-4"><Playlists /></div>
          <div className="mb-4"><CommunityResults /></div>
        </div>
        <div className="col-12 col-lg-3" style={{ paddingLeft: '0' }}>
          <Sidebar />
        </div>
      </div>
        <div className = "d-lg-none" style = {{height: "60px"}}/>
    </div>
  );
};

export default ViewProfile;
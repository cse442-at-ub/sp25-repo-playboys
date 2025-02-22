import React from 'react';
import ProfileHeader from './ProfileHeader';
import TopArtists from './TopArtists';
import Playlists from './Playlists';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="container-fluid bg-white py-4">
      <div className="row">
        <div className="col-lg-9">
          <div className="mt-5">
            <ProfileHeader />
            <TopArtists />
            <Playlists />
          </div>
        </div>
        <div className="col-lg-3">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default App;
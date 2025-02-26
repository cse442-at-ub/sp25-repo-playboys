import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import TopArtists from './TopArtists';
import Playlists from './Playlists';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import TopArtistsView from './TopArtistsView';
import EditProfile from './EditProfile';
import PlaylistsView from './PlaylistsView';
import LandingPage from './LandingPage.tsx';

function App() {
  return (
    <Router>
      <div className="container-fluid bg-white py-4">
        <div className="row">
          <div className="col-lg-9">
            <LandingPage/>
            {/*
            <Routes>
              <Route path="/" element={[<ProfileHeader />, <TopArtists />, <Playlists />]} />
              <Route path="/top-artists" element={<TopArtistsView />} />
              <Route path="/playlist-view" element={<PlaylistsView />} />
              <Route path="/edit-profile" element={<EditProfile />} />
            </Routes>
          <div className="col-lg-3">
            <Sidebar />
          </div>
            */}
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
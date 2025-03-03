import React from 'react';
import logo from './logo.svg';
import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Import all the pages
import LandingPage from "./landing_page/landingPage";
import UserProfile from './user_profile/userProfile';
import TopArtistsView from './user_profile/TopArtistsView';
import EditProfile from './user_profile/EditProfile';
import PlaylistsView from './user_profile/PlaylistsView';

// Import mobile components
import MobileProfile from './mobile_profile/MobileProfile';
import MobileEditProfile from './mobile_profile/MobileEditProfile';
import MobileTopArtistsPage from './mobile_profile/MobileTopArtistsView';
import MobilePlaylistsView from './mobile_profile/MobilePlaylistsView';

// Hook for detecting screen size
import useMediaQuery from './mobile_profile/useMediaQuery';

function App() {
  const isMobile = useMediaQuery('(max-width: 768px)'); // Detect mobile devices

  return (
    <Router>
      <Routes>
        <Route path="/" element={isMobile ? <MobileProfile /> : <UserProfile />} />
        <Route path="/userProfile" element={isMobile ? <MobileProfile /> : <UserProfile />} />
        <Route path="/top-artists" element={isMobile ? <MobileTopArtistsPage /> : <TopArtistsView />} />
        <Route path="/playlist-view" element={isMobile ? <MobilePlaylistsView /> : <PlaylistsView />} />
        <Route path="/edit-profile" element={isMobile ? <MobileEditProfile /> : <EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
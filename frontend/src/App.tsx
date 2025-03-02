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

// Hook for detecting screen size
import useMediaQuery from './mobile_profile/useMediaQuery';

function App() {
  const isMobile = useMediaQuery('(max-width: 768px)'); // Detect mobile devices

  return (
    <Router>
      <Routes>
        <Route path="/" element={isMobile ? <MobileProfile /> : <UserProfile />} />
        <Route path="/top-artists" element={isMobile ? <MobileProfile /> : <TopArtistsView />} />
        <Route path="/playlist-view" element={isMobile ? <MobileProfile /> : <PlaylistsView />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;


{/*
import React from 'react';
import logo from './logo.svg';
import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

//import all the pages created in the frontend
import LandingPage from "./landing_page/landingPage";
import UserProfile from './user_profile/userProfile';
import TopArtistsView from './user_profile/TopArtistsView';
import EditProfile from './user_profile/EditProfile';
import PlaylistsView from './user_profile/PlaylistsView';

import MobileTopArtists from './mobile_profile/MobileTopArtists';
import MobileProfileRecentActivity from './mobile_profile/MobileProfileRecentActivity';
import MobileNavigationBar from './mobile_profile/MobileNavigationBar';
import MobileProfile from './mobile_profile/MobileProfile';

//import all the pages created in the frontend FOR MOBILE



function App() {
  return (
    //add routes for each page created in the frontend
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/top-artists" element={<TopArtistsView />} />
        <Route path="/playlist-view" element={<PlaylistsView />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        
 
      </Routes>
    </Router>
  );
}

export default App;
*/}


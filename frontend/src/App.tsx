import React from 'react';
import logo from './logo.svg';
import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

//import all the pages created in the frontend

import Register from "./login_screens/register/register";
import Login from "./login_screens/login/login";
import Forgot from "./login_screens/forgot/forgot";
import LandingPage from "./landing_page/landingPage";
import UserProfile from './user_profile/userProfile';
import TopArtistsView from './user_profile/TopArtistsView';
import EditProfile from './user_profile/EditProfile';
import PlaylistsView from './user_profile/PlaylistsView';

// Import mobile components
import MobileLandingPage from './mobile_login_views/mobile_landing_page/mobile_landing_page'
import MobileLogin from './mobile_login_views/mobile_login/mobile_login';
import MobileForgotPassword from './mobile_login_views/mobile_forgot/mobile_forgot'
import MobileRegister from './mobile_login_views/mobile_register/mobile_register'

// Hook for detecting screen size
import useMediaQuery from './mobile_login_views/useMediaQuery';

function App() {

  const isMobile = useMediaQuery('(max-width: 768px)'); // Detect mobile devices

  return (
    //add routes for each page created in the frontend
    <Router>
      <Routes>
        <Route path="/register" element={isMobile ? <MobileRegister/> : <Register />} />
        <Route path="/login" element={isMobile ? <MobileLogin /> : <Login />} />
        <Route path="/forgot" element={isMobile ? <MobileForgotPassword /> :<Forgot />} />

        <Route path="/" element={isMobile ? <MobileLandingPage/> : <LandingPage />} />

        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/top-artists" element={<TopArtistsView />} />
        <Route path="/playlist-view" element={<PlaylistsView />} />
        <Route path="/edit-profile" element={<EditProfile />} />
 
      </Routes>
    </Router>
  );
}

export default App;


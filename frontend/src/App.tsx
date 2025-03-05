import React from 'react';
import logo from './logo.svg';
import './App.css';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

//import all the pages created in the frontend

import Register from "./login_screens/register/register";
import Login from "./login_screens/login/login";
import Forgot from "./login_screens/forgot/forgot";
import LandingPage from "./landing_page/landingPage";
import UserProfile from './user_profile/userProfile';
import TopArtistsView from './user_profile/TopArtistsView';
import EditProfile from './user_profile/EditProfile';
import PlaylistsView from './user_profile/PlaylistsView';

//import all the pages created in the frontend
import Register from "./login_screens/register/register";
import Login from "./login_screens/login/login";
import Forgot from "./login_screens/forgot/forgot";
import Settings from "./Settings/Settings";
import SettingsAccount from "./Settings/Account";
import SettingsApplicaton from "./Settings/Applicaton";
import SettingsCommunity from "./Settings/Community";
import SettingsNotifications from "./Settings/Notifications";
import SettingsPlayback from "./Settings/Playback";
import SettingsPrivacy from "./Settings/Privacy";
import DeleteAccount from './Settings/Account_settings/DeleteAccount';

function PathGuard({ allowedPathStart, children }: { allowedPathStart: string, children: React.ReactNode }) {
  const location = useLocation();

  // Check if the path starts with the allowed prefix
  if (!location.pathname.startsWith(allowedPathStart)) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    //add routes for each page created in the frontend
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/account" element={<SettingsAccount />} />
        <Route path="/settings/app" element={<SettingsApplicaton />} />
        <Route path="/settings/community" element={<SettingsCommunity />} />
        <Route path="/settings/notifications" element={<SettingsNotifications />} />
        <Route path="/settings/playback" element={<SettingsPlayback />} />
        <Route path="/settings/privacy" element={<SettingsPrivacy />} />
        <Route path="/settings/account/delete_account" element={<DeleteAccount />} />   

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


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

// Hook for detecting screen size
import useMediaQuery from './useMediaQuery';

//import all mobile views for setting
import MobileSettings from './mobile_setting/MobileSettings';
import MobileSettingsAccount from './mobile_setting/MobileAccount';
import MobileSettingsApplication from './mobile_setting/MobileApplicaton';
import MobileSettingsCommunity from './mobile_setting/MobileCommunity';
import MobileSettingsNotifications from './mobile_setting/MobileNotifications';
import MobileSettingsPlayback from './mobile_setting/MobilePlayback';
import MobileSettingsPrivacy from './mobile_setting/MobilePrivacy';
import MobileDeleteAccount from './mobile_setting/Mobile_Account_settings/MobileDeleteAccount';

function App() {
  const isMobile = useMediaQuery('(max-width: 768px)'); // Detect mobile devices
  return (
    //add routes for each page created in the frontend
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/settings" element={isMobile ? <MobileSettings/> : <Settings />} />
        <Route path="/settings/account" element={isMobile ? <MobileSettingsAccount/> : <SettingsAccount />} />
        <Route path="/settings/app" element={ isMobile ? <MobileSettingsApplication/> : <SettingsApplicaton />} />
        <Route path="/settings/community" element={isMobile ? <MobileSettingsCommunity/> : <SettingsCommunity />} />
        <Route path="/settings/notifications" element={isMobile ? <MobileSettingsNotifications/> : <SettingsNotifications />} />
        <Route path="/settings/playback" element={isMobile ? <MobileSettingsPlayback/> : <SettingsPlayback />} />
        <Route path="/settings/privacy" element={isMobile ? <MobileSettingsPrivacy/> : <SettingsPrivacy />} />
        <Route path="/settings/account/delete_account" element={isMobile ? <MobileDeleteAccount/> : <DeleteAccount />} />   

        <Route path="/" element={<Settings />} />

        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/top-artists" element={<TopArtistsView />} />
        <Route path="/playlist-view" element={<PlaylistsView />} />
        <Route path="/edit-profile" element={<EditProfile />} />
 
      </Routes>
    </Router>
  );
}

export default App;


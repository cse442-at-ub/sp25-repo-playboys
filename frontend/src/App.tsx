import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"; // Import the protected route component

// Import all pages
import LandingPage from "./landing_page/landingPage";
import UserProfile from "./user_profile/userProfile";
import TopArtistsView from "./user_profile/TopArtistsView";
import EditProfile from "./user_profile/EditProfile";
import PlaylistsView from "./user_profile/PlaylistsView";

// Login and settings
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
import DeleteAccount from "./Settings/Account_settings/DeleteAccount";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />

        {/* 1. Protected Routes: All of these paths need login to access (can still be bypassed but no senstive information will be on it).
            2. Still have to make sure to check auth tokencookie everytime a user wants to check or access their information in the backend for the different pages 
        */}
        <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
        <Route path="/settings/account" element={<ProtectedRoute element={<SettingsAccount />} />} />
        <Route path="/settings/app" element={<ProtectedRoute element={<SettingsApplicaton />} />} />
        <Route path="/settings/community" element={<ProtectedRoute element={<SettingsCommunity />} />} />
        <Route path="/settings/notifications" element={<ProtectedRoute element={<SettingsNotifications />} />} />
        <Route path="/settings/playback" element={<ProtectedRoute element={<SettingsPlayback />} />} />
        <Route path="/settings/privacy" element={<ProtectedRoute element={<SettingsPrivacy />} />} />
        <Route path="/settings/account/delete_account" element={<ProtectedRoute element={<DeleteAccount />} />} />
        <Route path="/userprofile" element={<ProtectedRoute element={<UserProfile />} />} />
        <Route path="/top-artists" element={<ProtectedRoute element={<TopArtistsView />} />} />
        <Route path="/playlist-view" element={<ProtectedRoute element={<PlaylistsView />} />} />
        <Route path="/edit-profile" element={<ProtectedRoute element={<EditProfile />} />} />
      </Routes>
    </Router>
  );
}

export default App;


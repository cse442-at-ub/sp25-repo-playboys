import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import  Register  from "./login_screens/register/register";
import  Login  from "./login_screens/login/login";
import  Forgot from "./login_screens/forgot/forgot";
import Settings from "./Settings/Settings";
import SettingsAccount from "./Settings/Account";
import SettingsApplicaton from "./Settings/Applicaton";
import SettingsCommunity from "./Settings/Community";
import SettingsNotifications from "./Settings/Notifications";
import SettingsPlayback from "./Settings/Playback";
import SettingsPrivacy from "./Settings/Privacy";
import DeleteAccount from './Settings/Account_settings/DeleteAccount';



function App() {
  return (
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
      </Routes>
    </Router>
  );
}

export default App;

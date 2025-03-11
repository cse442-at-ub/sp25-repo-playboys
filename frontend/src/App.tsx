import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from './ProtectedRoute'; // Import the protected route component

//landing pages
import MobileLandingPage from './mobile_landing_page/mobile_landing_page'
import LandingPage from './landing_page/landingPage';

//Profile Components
import UserProfile from './user_profile/userProfile';
import TopArtistsView from './user_profile/TopArtistsView';
import EditProfile from './user_profile/EditProfile';
import PlaylistsView from './user_profile/PlaylistsView';
// Import mobile Profile
import MobileProfile from './mobile_profile/MobileProfile';
import MobileEditProfile from './mobile_profile/MobileEditProfile';
import MobileTopArtistsPage from './mobile_profile/MobileTopArtistsView';
import MobilePlaylistsView from './mobile_profile/MobilePlaylistsView';

// Login and Sign Up Components
import Register from './login_screens/register/register';
import Login from './login_screens/login/login';
import Forgot from './login_screens/forgot/forgot';
import ResetPassword from './login_screens/forgot/new_password';
// Import mobile Login and Sign Up
import MobileLogin from './mobile_login_views/mobile_login/mobile_login';
import MobileRegister from './mobile_login_views/mobile_register/mobile_register';

//Settings Components
import Settings from './Settings/Settings';
import SettingsAccount from './Settings/Account';
import SettingsApplicaton from './Settings/Applicaton';
import SettingsCommunity from './Settings/Community';
import SettingsNotifications from './Settings/Notifications';
import SettingsPlayback from './Settings/Playback';
import SettingsPrivacy from './Settings/Privacy';
import DeleteAccount from './Settings/Account_settings/DeleteAccount';
import ProfileVisibility from './Settings/Privacy_settings/ProfileVisibilityOptions'
import FriendRequest from './Settings/community_settings/friendRequest';
//import all mobile views for setting
import MobileSettings from './mobile_setting/MobileSettings';
import MobileSettingsAccount from './mobile_setting/MobileAccount';
import MobileSettingsApplication from './mobile_setting/MobileApplicaton';
import MobileSettingsCommunity from './mobile_setting/MobileCommunity';
import MobileSettingsNotifications from './mobile_setting/MobileNotifications';
import MobileSettingsPlayback from './mobile_setting/MobilePlayback';
import MobileSettingsPrivacy from './mobile_setting/MobilePrivacy';
import MobileDeleteAccount from './mobile_setting/Mobile_Account_settings/MobileDeleteAccount';

// import all statistics views
import { StatisticsOverview } from "./statistics_page/statistics_overview";
import { StatisticsDetails } from "./statistics_page/statistics_details";
import { SampleStatistics } from "./statistics_page/sample_statistics";

// Hook for detecting screen size
import useMediaQuery from './useMediaQuery';

function App() {

  const isMobile = useMediaQuery('(max-width: 768px)'); // Detect mobile devices

  return (
    <Router>
      <Routes>
        <Route path="/" element={isMobile ? <MobileLandingPage/> : <LandingPage />} />``
        <Route path="/register" element={isMobile ? <MobileRegister/> : <Register />} />
        <Route path="/login" element={isMobile ? <MobileLogin /> : <Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/forgot/reset" element={<ResetPassword />} />
        <Route path="/statistics" element={<StatisticsOverview 
                                            topX={3}
                                            topArtistsLastMonth={SampleStatistics.topArtistsLastMonth} 
                                            topArtistsLast90Days={SampleStatistics.topArtistsLast90Days} 
                                            topArtistsLastYear={SampleStatistics.topArtistsLastYear} 
                                            topSongsLastMonth={SampleStatistics.topSongsLastMonth} 
                                            topSongsLast90Days={SampleStatistics.topSongsLast90Days} 
                                            topSongsLastYear={SampleStatistics.topSongsLastYear} 
                                            topAlbumsLastMonth={SampleStatistics.topAlbumsLastMonth} 
                                            topAlbumsLast90Days={SampleStatistics.topAlbumsLast90Days} 
                                            topAlbumsLastYear={SampleStatistics.topAlbumsLastYear}/>} />
        <Route path="/statistics/details" element={<StatisticsDetails 
                                            topX={8}
                                            topArtistsLastMonth={SampleStatistics.topArtistsLastMonth} 
                                            topArtistsLast90Days={SampleStatistics.topArtistsLast90Days} 
                                            topArtistsLastYear={SampleStatistics.topArtistsLastYear} 
                                            topSongsLastMonth={SampleStatistics.topSongsLastMonth} 
                                            topSongsLast90Days={SampleStatistics.topSongsLast90Days} 
                                            topSongsLastYear={SampleStatistics.topSongsLastYear} 
                                            topAlbumsLastMonth={SampleStatistics.topAlbumsLastMonth} 
                                            topAlbumsLast90Days={SampleStatistics.topAlbumsLast90Days} 
                                            topAlbumsLastYear={SampleStatistics.topAlbumsLastYear}/>} />
      



        {/* 1. Protected Routes: All of these paths need login to access (can still be bypassed but no senstive information will be on it).
            2. Still have to make sure to check auth tokencookie everytime a user wants to check or access their information in the backend for the different pages 
        */}
        <Route path="/settings" element={<ProtectedRoute element={isMobile ? <MobileSettings/> : <Settings />} />} />
        <Route path="/settings/account" element={<ProtectedRoute element={isMobile ? <MobileSettingsAccount/> : <SettingsAccount />} />} />
        <Route path="/settings/app" element={<ProtectedRoute element={isMobile ? <MobileSettingsApplication/> : <SettingsApplicaton />} />} />
        <Route path="/settings/community" element={<ProtectedRoute element={isMobile ? <MobileSettingsCommunity/> : <SettingsCommunity />} />} />
        <Route path="/settings/notifications" element={<ProtectedRoute element={isMobile ? <MobileSettingsNotifications/> : <SettingsNotifications />} />} />
        <Route path="/settings/playback" element={<ProtectedRoute element={isMobile ? <MobileSettingsPlayback/> : <SettingsPlayback />} />} />
        <Route path="/settings/privacy" element={<ProtectedRoute element={isMobile ? <MobileSettingsPrivacy/> : <SettingsPrivacy />} />} />
        <Route path="/settings/account/delete_account" element={<ProtectedRoute element={isMobile ? <MobileDeleteAccount/> : <DeleteAccount />} />} />
        <Route path="/settings/privacy/profile_visibility" element={<ProtectedRoute element={isMobile ? <ProfileVisibility/> : <ProfileVisibility />} />} />
        <Route path="/userprofile" element={<ProtectedRoute element={isMobile ? <MobileProfile /> : <UserProfile />} />} />
        <Route path="/top-artists" element={<ProtectedRoute element={isMobile ? <MobileTopArtistsPage /> : <TopArtistsView />} />} />
        <Route path="/playlist-view" element={<ProtectedRoute element={isMobile ? <MobilePlaylistsView /> : <PlaylistsView />} />} />
        <Route path="/edit-profile" element={<ProtectedRoute element={isMobile ? <MobileEditProfile /> : <EditProfile />} />} />
        <Route path="/settings/community/friend_requests" element={<ProtectedRoute element={<FriendRequest />} />} />
        </Routes>
    </Router>
  );
}

export default App;


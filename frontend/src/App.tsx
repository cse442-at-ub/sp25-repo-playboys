import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"; // Import the protected route component

//landing pages
import LandingPage from "./landing_page/landingPage";

//Profile Components
import UserProfile from "./user_profile/userProfile";
import TopArtistsView from "./user_profile/TopArtistsView";
import EditProfile from "./user_profile/EditProfile";
import PlaylistsView from "./user_profile/PlaylistsView";
// Import mobile Profile

// Import mobile Login and Sign Up
import Register from "./login_screens/register/register";
import Login from "./login_screens/login/login";
import Forgot from "./login_screens/forgot/forgot";
import Reset from './login_screens/forgot/reset';
// Import mobile Login and Sign Up

import StyleGuide from "./style_guide";
//Settings Components
import Settings from "./Settings/Settings";
import SettingsAccount from "./Settings/Account";
import SettingsApplicaton from "./Settings/Applicaton";
import SettingsCommunity from "./Settings/Community";
import SettingsNotifications from "./Settings/Notifications";
import SettingsPlayback from "./Settings/Playback";
import SettingsPrivacy from "./Settings/Privacy";
import DeleteAccount from "./Settings/Account_settings/DeleteAccount";
import ProfileVisibility from './Settings/Privacy_settings/ProfileVisibilityOptions'
import FriendRequest from "./Settings/community_settings/friendRequest";
// Coummunity Components
// import CommunityPage from "./communities/comunity_page";

// Feed Compnents
import Feed from "./feed/feed";
import PostPage from "./feed/post";
import SearchPage from "./search_result_page/searchResultPage";
import SpotifyPlayer from "./spotify_player/SpotifyPlayer";


//import Community Page
import CommunityPage from "./communities/CommunityPage";
import CreateCommunityPage from "./communities/CreateCommunityPage";

//Import SongRecommendation
import SongRecommendation from "./song_recommendation/SongRecommendationFE";

// Explore Page
import Explore from "./explore/explore";
import GenrePage from "./explore/genre";
import ArtistPage from "./explore/artistPage";

// Statistics
import StatisticsOverview from "./statistics_page/statistics_overview";
import StatisticsDetails from "./statistics_page/statistics_details";
//friendlist page 
import FriendList from "./friend_list/friendList";

// Hook for detecting screen size
import useMediaQuery from './useMediaQuery';

// csrf wrap protection
import { CSRFProvider } from "./csrfContent";

function App() {

  const isMobile = useMediaQuery('(max-width: 768px)'); // Detect mobile devices

  return (
    <CSRFProvider>
    <Router>
      <Routes>
      <Route path="/style_guide" element={<StyleGuide />}></Route>
        <Route path="/" element={ <LandingPage />} />
        <Route path="/register" element={ <Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/forgot/reset/:email" element={<Reset />}/>
        <Route path="/explore" element={<ProtectedRoute element={<Explore />} />} />
        <Route path="/explore/genre/:genre" element={<ProtectedRoute element={<GenrePage />} />} />
        <Route path="/explore/artist/:artist" element={<ProtectedRoute element={<ArtistPage />} />} />
        <Route path="/forgot/reset" element={<Reset />} />
        <Route path="/statistics" element={<StatisticsOverview />} />
        <Route path="/statistics/details" element={<StatisticsDetails />} />
      
        {/* 1. Protected Routes: All of these paths need login to access (can still be bypassed but no senstive information will be on it).
            2. Still have to make sure to check auth tokencookie everytime a user wants to check or access their information in the backend for the different pages 
        */}
        <Route path="/settings" element={<ProtectedRoute element={ <Settings />} />} />
        <Route path="/settings/account" element={<ProtectedRoute element={ <SettingsAccount />} />} />
        <Route path="/settings/app" element={<ProtectedRoute element={<SettingsApplicaton />} />} />
        <Route path="/settings/community" element={<ProtectedRoute element={<SettingsCommunity />} />} />
        <Route path="/settings/notifications" element={<ProtectedRoute element={ <SettingsNotifications />} />} />
        <Route path="/settings/playback" element={<ProtectedRoute element={<SettingsPlayback />} />} />
        <Route path="/settings/privacy" element={<ProtectedRoute element={ <SettingsPrivacy />} />} />
        <Route path="/settings/account/delete_account" element={<ProtectedRoute element={ <DeleteAccount />} />} />
        <Route path="/settings/privacy/profile_visibility" element={<ProtectedRoute element={<ProfileVisibility />} />} />
        <Route path="/userprofile" element={<ProtectedRoute element={ <UserProfile />} />} />
        <Route path="/top-artists" element={<ProtectedRoute element={ <TopArtistsView />} />} />
        <Route path="/playlist-view" element={<ProtectedRoute element={<PlaylistsView />} />} />
        <Route path="/edit-profile" element={<ProtectedRoute element={<EditProfile />} />} />
        <Route path="/settings/community/friend_requests" element={<ProtectedRoute element={<FriendRequest />} />} />
        
      
        <Route path="/friendlist" element={<ProtectedRoute element={<FriendList />}/>} />
        
        <Route path="/search_results" element={<ProtectedRoute element= {<SearchPage />} />} />
  
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/post" element={<PostPage />} />
      </Routes>
    </Router>
    </CSRFProvider>
  );
}

export default App;


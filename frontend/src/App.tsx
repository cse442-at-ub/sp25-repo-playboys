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


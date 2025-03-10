import React from 'react';
import Sidebar from '../user_profile/Sidebar';
import SearchBar from './searchBar';
import SongResults from './songResults'
import ArtistResults from './artistResults';
import EventResults from './eventResults';
import CommunityResults from './communityResults';
import './SearchResultPage.css'; // Import the CSS file for styling

const SearchResultPage = () => {

    const handleBackButton = () => {
        console.log("Go back clicked");
        // Your navigation code here
    };

    return (
        <div className="search-result-container">
            <div className="main-content">
                <div className="search-bar-row">
                    <button className="back-button" onClick={handleBackButton} aria-label="Go back">
                        ←
                    </button>
                    <div className="search-bar-container">
                        <SearchBar />
                    </div>
                </div>
                <div className="song-results">
                    {/* Search Results Content Goes Here */}
                    <SongResults />
                </div>
                <div className="artist-results">
                    <ArtistResults />
                </div>
                <div className="community-results">
                    <CommunityResults />
                </div>
                <div className="event-results">
                    <EventResults />
                </div>
            </div>
            <div className="sidebar-container">
                <Sidebar />
            </div>
        </div>
    );
};

export default SearchResultPage;


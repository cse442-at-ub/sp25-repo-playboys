import React from "react";
import { useNavigate } from 'react-router-dom';
import "./CommunityPage.css";

const CommunityPage = () => {
    const myCommunities = [
        "Drake", "Ado", "Limit", "Rock Legends", "Jazz Vibes", "Pop Culture", 
        "Hip-Hop Heads", "EDM Nation", "Indie Sounds", "K-Pop World", "Classical Symphony", 
        "Blues Journey", "Reggae Rhythm"
    ];
    const recommendedCommunities = [
        "Hip-Hop Heads", "Classical Masters", "EDM Nation", "Chill Beats", "Lo-Fi Lounge", 
        "Electronic Pulse", "Rock Forever", "Indie Underground", "Jazz Collective", "Vocalists Unite", 
        "Dance All Night", "Experimental Sounds"
    ];

    const navigate = useNavigate();

    const handleBackButton = () => {
        console.log("Go back clicked");
        navigate("/settings");
    };

    return (
        <div className="community-page">
            <div className="community-header">
                <h1>Community Page</h1>
                <div className="community-search-container">
                    <input type="text" placeholder="Search for communities..." />
                </div>
            </div>

            {/* My Communities */}
            <h2>My Communities</h2>
            <div className="community-scrollable-list">
                {myCommunities.map((item, index) => (
                    <div className="community-item" key={index}>
                        <button className="community-button">
                            <div className="community-image"></div>
                            <span>{item}</span>
                        </button>
                    </div>
                ))}
            </div>

            {/* Recommended Communities */}
            <h2>Recommended Communities</h2>
            <div className="community-scrollable-list">
                {recommendedCommunities.map((item, index) => (
                    <div className="community-item" key={index}>
                        <button className="community-button">
                            <div className="community-image"></div>
                            <span>{item}</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommunityPage;

import React, { useState, useEffect } from 'react';
import './statistics.css';
import { useNavigate } from "react-router-dom";
import { useCSRFToken } from "../csrfContent";
import Sidebar from '../user_profile/Sidebar';
import { useSidebar } from "../SidebarContext";

type TimeRange = "short_term" | "medium_term" | "long_term";

interface ListeningItem {
  rank: number;
  name: string;
  image: string;
  popularity: number;
}

const StatisticsOverview: React.FC = () => {
  const navigate = useNavigate();
  const { csrfToken } = useCSRFToken();
  const { isOpen } = useSidebar();

  const [artistTimeRange, setArtistTimeRange] = useState<TimeRange>("medium_term");
  const [trackTimeRange, setTrackTimeRange] = useState<TimeRange>("medium_term");
  const [topArtists, setTopArtists] = useState<ListeningItem[]>([]);
  const [topTracks, setTopTracks] = useState<ListeningItem[]>([]);
  const [userType, setUserType] = useState<"spotify" | "nonspotify" | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}backend/userTop50X.php?type=artists&time_range=${artistTimeRange}`, {
        credentials: "include",
        headers: { "CSRF-Token": csrfToken }
      });
      const data = await res.json();
      setTopArtists(data);
    };
    fetchArtists();
  }, [artistTimeRange, csrfToken]);

  useEffect(() => {
    const fetchTracks = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}backend/userTop50X.php?type=tracks&time_range=${trackTimeRange}`, {
        credentials: "include",
        headers: { "CSRF-Token": csrfToken }
      });
      const data = await res.json();
      setTopTracks(data);
    };
    fetchTracks();
  }, [trackTimeRange, csrfToken]);

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}backend/getLoginType.php`, { credentials: "include" });
        const data = await res.json();
        setUserType(data.status === "success" && data.is_spotify_user ? "spotify" : "nonspotify");
      } catch (error) {
        console.error("Error checking user type:", error);
        setUserType("nonspotify");
      }
    };
    checkUserType();
  }, []);

  if (userType === "nonspotify") {
    return (
      <div className="statistics-container">
        <Sidebar />
        <div className="main-content">
          <button className="back-button" onClick={() => navigate("/explore")}>←</button>
          <div className="statistics-content">
            <h2>You must log in with Spotify to use this feature.</h2>
          </div>
        </div>
      </div>
    );
  }

  const topArtist = topArtists[0];
  const topSong = topTracks[0];

  return (
    <div className="statistics-container">
      <Sidebar />
      <div className={`main-content ${isOpen ? 'sidebar-expanded' : ''}`}>
      <header className="statistics-header">
        <h1 className="statistics-title">Statistics</h1>
      </header>
      <button onClick={() => navigate("/explore")} className="back-button">←</button>

        {topArtist && (
          <div className="highlight-container">
            <div className="highlight-section">
              <div className="circle-image">
                {topArtist.image ? <img src={topArtist.image} alt={topArtist.name} /> : <div className="image-placeholder" />}
              </div>
              <div className="highlight-label">Top Artist: <strong>{topArtist.name}</strong></div>
            </div>

            <div className="statistics-leaderboard-container">
              <h2 className="leaderboard-title">Top Artists</h2>
              <select
                className="statistics-select"
                value={artistTimeRange}
                onChange={(e) => setArtistTimeRange(e.target.value as TimeRange)}
              >
                <option value="short_term">Last Month</option>
                <option value="medium_term">Last 90 Days</option>
                <option value="long_term">Last Year</option>
              </select>
              <div className="leaderboard-items">
                {topArtists.slice(1, 10).map((item) => (
                  <div key={`artist-${item.rank}`} className="leaderboard-item">
                    <span className="item-rank">{item.rank}</span>
                    <div className="item-image-container">
                      {item.image ? <img src={item.image} alt={item.name} className="item-image" /> : <div className="item-image-placeholder"><span>No image</span></div>}
                    </div>
                    <div className="item-details">
                      <div className="item-name">{item.name}</div>
                    </div>
                    <div className="item-stats">
                      <div className="item-play-count">{item.popularity}</div>
                      <div className="item-percentage">Popularity Score</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="details-button" onClick={() => navigate("/statistics/details", { state: { type: "artists", timeRange: artistTimeRange } })}>
                View More
              </button>
            </div>
          </div>
        )}

        {topSong && (
          <div className="highlight-container reverse">
            <div className="highlight-section">
              <div className="circle-image">
                {topSong.image ? <img src={topSong.image} alt={topSong.name} /> : <div className="image-placeholder" />}
              </div>
              <div className="highlight-label">Top Song: <strong>{topSong.name}</strong></div>
            </div>

            <div className="statistics-leaderboard-container">
              <h2 className="leaderboard-title">Top Songs</h2>
              <select
                className="statistics-select"
                value={trackTimeRange}
                onChange={(e) => setTrackTimeRange(e.target.value as TimeRange)}
              >
                <option value="short_term">Last Month</option>
                <option value="medium_term">Last 90 Days</option>
                <option value="long_term">Last Year</option>
              </select>
              <div className="leaderboard-items">
                {topTracks.slice(1, 10).map((item) => (
                  <div key={`track-${item.rank}`} className="leaderboard-item">
                    <span className="item-rank">{item.rank}</span>
                    <div className="item-image-container">
                      {item.image ? <img src={item.image} alt={item.name} className="item-image" /> : <div className="item-image-placeholder"><span>No image</span></div>}
                    </div>
                    <div className="item-details">
                      <div className="item-name">{item.name}</div>
                    </div>
                    <div className="item-stats">
                      <div className="item-play-count">{item.popularity}</div>
                      <div className="item-percentage">Popularity Score</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="details-button" onClick={() => navigate("/statistics/details", { state: { type: "tracks", timeRange: trackTimeRange } })}>
                View More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsOverview;
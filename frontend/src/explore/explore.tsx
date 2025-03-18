import React, { useState, useEffect } from "react";
import "./explore.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../user_profile/Sidebar";

const genres = [
  { name: "Rock", color: "#A44036" },
  { name: "Pop", color: "#E91E63" },
  { name: "K-Pop", color: "#9C27B0" },
  { name: "Country", color: "#2196F3" },
  { name: "Classical", color: "#FFC107" },
  { name: "Introspective", color: "#4CAF50" },
  { name: "Electronic", color: "#00BCD4" },
];

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [topGenres, setTopGenres] = useState<any[]>([]); // new state for top Genres

  // Fetch top artists.
  useEffect(() => {
    fetch(`https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442ah/backend/topArtists.php`)
      .then((response) => response.json())
      .then((data) => {
        setTopArtists(data);
      })
      .catch((error) => console.error("Error fetching top artists:", error));
  }, []);

  // Fetch top songs.
  useEffect(() => {
    fetch(`https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442ah/backend/topSongs.php`)
      .then((response) => response.json())
      .then((data) => {
        setTopTracks(data);
      })
      .catch((error) => console.error("Error fetching top songs:", error));
  }, []);

  // Fetch top genres.
  useEffect(() => {
    fetch(`https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442ah/backend/topGenres.php`)
      .then((response) => response.json())
      .then((data) => {
        setTopGenres(data);
      })
      .catch((error) => console.error("Error fetching top Genres:", error));
  }, []);

  const handleGenreClick = (genre: string) => {
    navigate(`/explore/${genre.toLowerCase()}`);
  };
  const handleArtistClick = (artist: string) => {
    navigate(`/explore/${artist.toLowerCase()}`);
  };
  const handleSongClick = (song: string) => {
    navigate(`/explore/${song.toLowerCase()}`);
  };

  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  

  return (
    <div className="explore-page">
      <Sidebar />
      <div className="explore-content">
        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search for a genre, artist, songs... 🔍"
          />
        </div>

        {/* What Are People Listening To */}
        <h2 className="section-title">Popularity List</h2>
        <div className="listening-container">
          {/* Top Songs */}
          <div className="listening-column">
            <h3>
              <center>Top Songs</center>
            </h3>
            {topTracks.length > 0 ? (
              topTracks.slice(0, 5).map((track, index) => (
                <div
                  className="list-item"
                  key={track.name + index}
                  onClick={() => handleSongClick(track.name)}
                  style={{ cursor: "pointer" }}
                >
                  {track.name} - {track.artist.name}
                </div>
              ))
            ) : (
              <p>Loading top songs...</p>
            )}
          </div>
          {/* Top Artists */}
          <div className="listening-column">
            <h3>
              <center>Top Artists</center>
            </h3>
            {topArtists.length > 0 ? (
              topArtists.slice(0, 5).map((artist, index) => (
                <div
                  className="list-item"
                  key={artist.name + index}
                  onClick={() => handleArtistClick(artist.name)}
                  style={{ cursor: "pointer" }}
                >
                  {artist.name}
                </div>
              ))
            ) : (
              <p>Loading top artists...</p>
            )}
          </div>
          {/* Top Genres */}
          <div className="listening-column">
            <h3>
              <center>Top Genres</center>
            </h3>
            {topGenres.length > 0 ? (
              topGenres.slice(0, 5).map((genre, index) => (
                <div
                  className="list-item"
                  key={genre.name + index}
                  style={{ cursor: "pointer" }}
                >
                  {capitalize(genre.name)}
                </div>
              ))
            ) : (
              <p>Loading top Genres...</p>
            )}
          </div>
        </div>

        {/* Genre Section */}
        <h2 className="section-title">Browse All</h2>
        <div className="genre-container">
          {genres.map((genre) => (
            <button
              key={genre.name}
              className="genre-box"
              style={{ backgroundColor: genre.color, cursor: "pointer" }}
              onClick={() => handleGenreClick(genre.name)}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Upcoming Events */}
        <h2 className="section-title">Upcoming Events</h2>
        <div className="events-container">
          <div className="event-circle">
            <div className="event-date">
              Feb 31
              <br />
              13:61 PM
            </div>
            <div className="event-location">Metlife</div>
          </div>
          <div className="event-circle">
            <div className="event-date">
              Jan 1
              <br />
              1:11 AM
            </div>
            <div className="event-location">Metlife</div>
          </div>
          <div className="event-circle">
            <div className="event-date">
              Aug 2
              <br />
              2:22 PM
            </div>
            <div className="event-location">Orchard Park</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;

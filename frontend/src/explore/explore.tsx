import React, { useState, useEffect } from "react";
import "./explore.css";
import { useNavigate } from "react-router-dom";
import SongRecommendation from "../song_recommendation/SongRecommendationFE";
import SpotifyPlayer from "../spotify_player/SpotifyPlayer"; // Adjust path if needed
import MainContent from "../MainContent"; // Adjust path if needed

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
  const [topGenres, setTopGenres] = useState<any[]>([]);
  const [activeTrack, setActiveTrack] = useState<{ url: string; title: string; artist: string } | null>(null);
  const [randomCommunities, setRandomCommunities] = useState<any[]>([]);

  const defaultImage = process.env.PUBLIC_URL + "/static/PlayBoysBackgroundImage169.jpeg";


  // Fetch top artists.
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}backend/topArtists.php`)
      .then((response) => response.json())
      .then((data) => {
        setTopArtists(data);
      })
      .catch((error) => console.error("Error fetching top artists:", error));
  }, []);

  // Fetch top songs.
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}backend/topSongs.php`)
      .then((response) => response.json())
      .then((data) => {
        setTopTracks(data);
      })
      .catch((error) => console.error("Error fetching top songs:", error));
  }, []);

  // Fetch top genres.
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}backend/topGenres.php`)
      .then((response) => response.json())
      .then((data) => {
        setTopGenres(data);
      })
      .catch((error) => console.error("Error fetching top Genres:", error));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}backend/custom_communities/getAllCommunities.php`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
    
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          const shuffled = data.communities.sort(() => 0.5 - Math.random());
          setRandomCommunities(shuffled.slice(0, 8));
        }
      })
      .catch(err => console.error("Error loading communities:", err));
  }, []);  

  const handleGenreClick = (genre: string) => {
    navigate(`/explore/genre/${genre.toLowerCase()}`);
  };
  const handleArtistClick = (artist: string) => {
    navigate(`/explore/artist/${artist.toLowerCase()}`);
  };
  const handleSongClick = async (song: string, artist: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}backend/playSong.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ song_name: song, artist_name: artist })
      });
  
      const result = await response.json();
      if (result.status === 'success') {
        // Save track URL along with song title and artist name
        setActiveTrack({ url: result.trackUrl, title: song, artist: artist });
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error playing song:", error);
    }
  };
  
  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <MainContent>
    <div className="ep-explore-page">
      <div className="ep-explore-content">
        {/* Search Bar */}
        <div className="ep-search-bar-container">
          <input
            type="text"
            className="ep-search-bar"
            placeholder="Search for a genre, artist, songs... 🔍"
          />
        </div>

        {/* What Are People Listening To */}
        <h2 className="ep-section-title">Popularity List</h2>
        <div className="ep-listening-container">
          {/* Top Songs */}
          <div className="ep-listening-column">
            <h3>
              <center>Top Songs</center>
            </h3>
            {topTracks.length > 0 ? (
              topTracks.slice(0, 5).map((track, index) => (
                <div
                  className="ep-list-item"
                  key={track.name + index}
                  onClick={() => handleSongClick(track.name, track.artist.name)}
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
          <div className="ep-listening-column">
            <h3>
              <center>Top Artists</center>
            </h3>
            {topArtists.length > 0 ? (
              topArtists.slice(0, 5).map((artist, index) => (
                <div
                  className="ep-list-item"
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
          <div className="ep-listening-column">
            <h3>
              <center>Top Genres</center>
            </h3>
            {topGenres.length > 0 ? (
              topGenres.slice(0, 5).map((genre, index) => (
                <div
                  className="ep-list-item"
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

        {/* Communities Row */}
        <h2 className="ep-section-title">Communities</h2>
        <div className="ep-community-circle-row">
          {randomCommunities.map((comm) => (
            <div key={comm.community_id} className="ep-community-wrapper" onClick={() => navigate(`/community/${comm.community_id}`)}>
              <div
                className="ep-community-circle"
                style={{
                  backgroundImage: `url("${comm.background_image?.startsWith("data:image") ? comm.background_image : defaultImage}")`
                }}
              />
              <p className="ep-community-name">{comm.name}</p>
            </div>
          ))}
        </div>


        {/* Genre Section */}
        <h2 className="ep-section-title">Browse All</h2>
        <div className="ep-genre-container">
          {genres.map((genre) => (
            <button
              key={genre.name}
              className="ep-genre-box"
              style={{ backgroundColor: genre.color, cursor: "pointer" }}
              onClick={() => handleGenreClick(genre.name)}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Upcoming Events */}
        <h2 className="ep-section-title">Upcoming Events</h2>
        <div className="ep-events-container">
          <div className="ep-event-circle">
            <div className="ep-event-date">
              Feb 31
              <br />
              13:61 PM
            </div>
            <div className="ep-event-location">Metlife</div>
          </div>
          <div className="ep-event-circle">
            <div className="ep-event-date">
              Jan 1
              <br />
              1:11 AM
            </div>
            <div className="ep-event-location">Metlife</div>
          </div>
          <div className="ep-event-circle">
            <div className="ep-event-date">
              Aug 2
              <br />
              2:22 PM
            </div>
            <div className="ep-event-location">Orchard Park</div>
          </div>
        </div>
      </div>
      <div className="ep-songrecommend">
        <SongRecommendation />
      </div>
      {activeTrack && (
        <SpotifyPlayer
          trackUrl={activeTrack.url}
          title={activeTrack.title}
          artist={activeTrack.artist}
          onClose={() => setActiveTrack(null)}
        />
      )}
    </div>
    </MainContent>
  );
};

export default Explore;

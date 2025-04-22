import React, { useState, useEffect } from "react";
import "./explore.css";
import { useNavigate } from "react-router-dom";
import SongRecommendation from "../song_recommendation/SongRecommendationFE";
import SongRecommendationNonSpotify from "../song_recommendation/SongRecommendationNonSpotify";
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

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  image_url: string;
  creator: string;
}

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [topGenres, setTopGenres] = useState<any[]>([]);
  const [myEvents, setMyEvents] =  useState<Event[]>([]);
  const [activeTrack, setActiveTrack] = useState<{ url: string; title: string; artist: string } | null>(null);
  const [randomCommunities, setRandomCommunities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userType, setUserType] = useState<"spotify" | "nonspotify" | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(`/search_results?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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


  {/* fetch my events*/}
  useEffect(() => {
    const myEvent = async () => {
      try{
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/events/exploreEvents.php`,{
          method: "GET", 
          headers: 
          {
            "Content-Type": "application/json" 
          },
          credentials: "include"
        });
        const result = await response.json();
        if(result.status === "success"){
          setMyEvents(result.data);
        }else{
          console.log("no results found");
        }
      }catch (error){
        console.error("Error fetching My Events:", error);
      }
    }; 
    myEvent();
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
    fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/getAllCommunities.php`, {
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
          setRandomCommunities(shuffled.slice(0, 6));
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

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}backend/getLoginType.php`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.status === "success") {
          setUserType(data.is_spotify_user ? "spotify" : "nonspotify");
        } else {
          setUserType("nonspotify");
        }
      } catch (error) {
        console.error("Error checking login type:", error);
        setUserType("nonspotify");
      }
    };
  
    checkUserType();
  }, []);
  


  
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
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
                <div className="ep-list-item" key={track.name + index} onClick={() => handleSongClick(track.name, track.artist.name)}
                  style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px"}}>
                    <img src={track.image_url} alt={track.name} style={{ width: "40px", height: "40px", borderRadius: "5px" }} />
                  <span>{track.name} - {track.artist.name}</span>
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
                  onClick={() =>handleGenreClick(genre.name)}
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
          {randomCommunities.map((community) => (
            <div key={community.id} className="ep-community-wrapper" onClick={() => navigate(`/community/${community.name}`)}>
              <img
                  src={community.background_image}
                  className="community-circle-image"
                  alt={community.name}
                />

              <p className="ep-community-name">{community.name}</p>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <h2 className="ep-event-section-title">
          <span>Upcoming Events</span>
          <button
            className="ep-create-event-button"
            onClick={() => navigate("/event-creation")} // Adjust the navigation to your desired page
          >
            Create Event
          </button>
        </h2>
        <div className="ep-events-container">
          {myEvents.length > 0 ? (
            myEvents.map((event) => (
                <div
                key={event.id}
                className="ep-event-item"
                onClick={() => navigate(`/event?id=${event.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="ep-event-circle"
                  style={{
                    backgroundImage: `url(${event.image_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="ep-event-overlay">
                    <div className="ep-event-date">
                      {event.date}
                      <br />
                      {event.time}
                    </div>
                    <div className="ep-event-location">{event.location}</div>
                  </div>
                </div>
                <p className="ep-event-title">{event.title}</p>
              </div>
            ))
          ) : (
            <p>No upcoming events</p>
          )}
        </div>

        {/* Song Recommendation (after events) */}
        <div className="ep-songrecommend" style={{ marginTop: "40px" }}>
          {userType === "spotify" ? (
            <SongRecommendation />
          ) : userType === "nonspotify" ? (
            <SongRecommendationNonSpotify />
          ) : (
            <p>Loading recommendations...</p>
          )}
        </div>

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

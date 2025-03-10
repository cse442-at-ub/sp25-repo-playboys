import React from "react";
import "./explore.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../user_profile/Sidebar";

const genres = [
  { name: "Rock", color: "#A44036" },
  { name: "Pop", color: "#E91E63" },
  { name: "Kpop", color: "#9C27B0" },
  { name: "Country", color: "#2196F3" },
  { name: "Classical", color: "#FFC107" },
  { name: "Introspective", color: "#4CAF50" },
  { name: "Electronic", color: "#00BCD4" },
];


const Explore: React.FC = () => {
  const navigate = useNavigate();

  const handleGenreClick = (genre: string) => {
    navigate(`/genre/${genre.toLowerCase()}`);
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
            placeholder="Search for an album, genre, artist, songs... 🔍"
          />
        </div>

        {/* What Are People Listening To */}
        <h2 className="section-title">Popularity List</h2>
        <div className="listening-container">
          {/* Top Song */}
          <div className="listening-column">
            <h3>Top Songs</h3>
            <div className="list-item">Song 1: Artist 1</div>
            <div className="list-item">Song 2: Artist 2</div>
            <div className="list-item">Song 3: Artist 3</div>
            <div className="list-item">Song 4: Artist 4</div>
            <div className="list-item">Song 5: Artist 5</div>
          </div>
          {/* Top Artist */}
          <div className="listening-column">
            <h3>Top Artists</h3>
            <div className="list-item">Artist 1</div>
            <div className="list-item">Artist 2</div>
            <div className="list-item">Artist 3</div>
            <div className="list-item">Artist 4</div>
            <div className="list-item">Artist 5</div>
          </div>
          {/* Top Album */}
          <div className="listening-column">
            <h3>Top Albums</h3>
            <div className="list-item">Album 1</div>
            <div className="list-item">Album 2</div>
            <div className="list-item">Album 3</div>
            <div className="list-item">Album 4</div>
            <div className="list-item">Album 5</div>
          </div>
          {/* Top Genre */}
          <div className="listening-column">
            <h3>Top Genres</h3>
            <div className="list-item">Pop</div>
            <div className="list-item">Rock</div>
            <div className="list-item">Hip Hop</div>
            <div className="list-item">R&B</div>
            <div className="list-item">Country</div>
          </div>
        </div>

        {/* Genre Section */}
        <h2 className="section-title">Browse All</h2>
        <div className="genre-container">
          {genres.map((genre) => (
            <button
              key={genre.name}
              className="genre-box"
              style={{ backgroundColor: genre.color }}
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
              Feb 31<br />13:61 PM
            </div>
            <div className="event-location">Metlife</div>
          </div>
          <div className="event-circle">
            <div className="event-date">
              Jan 1<br />1:11 AM
            </div>
            <div className="event-location">Metlife</div>
          </div>
          <div className="event-circle">
            <div className="event-date">
              Aug 2<br />2:22 PM
            </div>
            <div className="event-location">Orchard Park</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Explore;
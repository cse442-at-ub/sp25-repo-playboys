import React from "react";
import "./explore.css";

const Explore: React.FC = () => {
  return (
    <div className="explore-page">
      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Try an album, genre, artist, songs..."
        />
      </div>

      {/* What Are People Listening To */}
      <h2 className="section-title">What Are People Listening To</h2>
      <div className="listening-container">
        {/* Top Song */}
        <div className="listening-column">
          <h3>Top Song</h3>
          <div className="list-item">Song 1 - Artist 1</div>
          <div className="list-item">Song 2 - Artist 2</div>
          <div className="list-item">Song 3 - Artist 3</div>
          <div className="list-item">Song 4 - Artist 4</div>
          <div className="list-item">Song 5 - Artist 5</div>
        </div>
        {/* Top Artist */}
        <div className="listening-column">
          <h3>Top Artist</h3>
          <div className="list-item">Artist 1</div>
          <div className="list-item">Artist 2</div>
          <div className="list-item">Artist 3</div>
          <div className="list-item">Artist 4</div>
          <div className="list-item">Artist 5</div>
        </div>
        {/* Top Album */}
        <div className="listening-column">
          <h3>Top Album</h3>
          <div className="list-item">Album 1</div>
          <div className="list-item">Album 2</div>
          <div className="list-item">Album 3</div>
          <div className="list-item">Album 4</div>
          <div className="list-item">Album 5</div>
        </div>
        {/* Top Genre */}
        <div className="listening-column">
          <h3>Top Genre</h3>
          <div className="list-item">Pop</div>
          <div className="list-item">Rock</div>
          <div className="list-item">Hip Hop</div>
          <div className="list-item">R&B</div>
          <div className="list-item">Country</div>
        </div>
      </div>

      {/* Genre Section */}
      <h2 className="section-title">Genre</h2>
      <div className="genre-container">
        <div className="genre-box" style={{ backgroundColor: "#F44336" }}> Rock </div>
        <div className="genre-box" style={{ backgroundColor: "#E91E63" }}> Pop </div>
        <div className="genre-box" style={{ backgroundColor: "#9C27B0" }}> Kpop </div>
        <div className="genre-box" style={{ backgroundColor: "#2196F3" }}> Country </div>
        <div className="genre-box" style={{ backgroundColor: "#FFC107" }}> Classical </div>
        <div className="genre-box" style={{ backgroundColor: "#4CAF50" }}> Introspective </div>
        <div className="genre-box" style={{ backgroundColor: "#00BCD4" }}> Electronic </div>
      </div>

      {/* Upcoming Events */}
      <h2 className="section-title">Upcoming Events</h2>
      <div className="events-container">
        <div className="event-circle">
          <div className="event-date">
            30th February<br/>20:00
          </div>
          <div className="event-location">Metlife</div>
        </div>
        <div className="event-circle">
          <div className="event-date">
            31th February<br/>24:00
          </div>
          <div className="event-location">Metlife</div>
        </div>
        <div className="event-circle">
          <div className="event-date">
            29th February<br/>19:00
          </div>
          <div className="event-location">Metlife</div>
        </div>
      </div>
    </div>
  );
};

export default Explore;

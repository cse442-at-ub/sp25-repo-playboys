import React from "react";
import "./ExplorePage.css";

const ExplorePage: React.FC = () => {
  return (
    <div className="explore-container">
      <header className="explore-header">
        <h1>Explore</h1>
        <input type="text" placeholder="Search music, artists, albums..." />
      </header>
      <section className="explore-content">
        <h2>Featured Playlists</h2>
        <div className="explore-grid">
          {/* Placeholder cards for featured playlists */}
          <div className="explore-card">Playlist 1</div>
          <div className="explore-card">Playlist 2</div>
          <div className="explore-card">Playlist 3</div>
          <div className="explore-card">Playlist 4</div>
        </div>
        <h2>New Releases</h2>
        <div className="explore-grid">
          {/* Placeholder cards for new releases */}
          <div className="explore-card">Album 1</div>
          <div className="explore-card">Album 2</div>
          <div className="explore-card">Album 3</div>
          <div className="explore-card">Album 4</div>
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;

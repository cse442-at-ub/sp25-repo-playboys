import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../user_profile/Sidebar";
import { useNavigate } from "react-router-dom";
import SpotifyPlayer from "../spotify_player/SpotifyPlayer";
import "./genre.css";

interface Song {
  name: string;
  artist: string;
}

const GenrePage: React.FC = () => {
  const { genre } = useParams<{ genre: string }>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<{ url: string; title: string; artist: string } | null>(null);
  const navigate = useNavigate();
  const handleArtistClick = (artist: string) => {
    navigate(`/explore/artist/${artist.toLowerCase()}`);
  };
  const handleSongClick = async (song: string, artist: string) => {
    try {
      const response = await fetch('https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442ah/backend/playSong.php', {
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
    const fetchGenreData = async () => {
      try {
        const response = await fetch(`https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442ah/backend/genreTopItems.php?genre=${genre}`);
        const data = await response.json();
        if (data.status === "success") {
          setSongs(data.topSongs || []);
          setArtists(data.topArtists || []);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch genre info.");
      }
    };

    fetchGenreData();
  }, [genre]);

  return (
    <div className="gp-genre-page">
      <Sidebar />
      <div className="gp-genre-content">
        <h1 className="gp-genre-title">
          {genre ? genre.charAt(0).toUpperCase() + genre.slice(1) : "Genre"}
        </h1>
        <p className="gp-genre-description">
          Explore the best in {genre} music—discover top tracks, albums, and artists.
        </p>

        {error && <p className="gp-text-danger">{error}</p>}

        <h2 className="gp-section-header">🎵 Top Songs</h2>
        <ul className="gp-song-list">
          {songs.map((song, index) => (
            <li key={index} className="gp-song"
              onClick={() => handleSongClick(song.name, song.artist)}
              style={{ cursor: "pointer" }}
              >
              {song.name} by {song.artist}
            </li>
          ))}
        </ul>

        <h2 className="gp-section-header">🌟 Top Artists</h2>
        <ul className="gp-artist-list">
          {artists.map((artist, index) => (
            <li key={index} className="gp-artist"
            onClick={() => handleArtistClick(artist)}
              style={{ cursor: "pointer" }}>
              {artist}
            </li>
          ))}
        </ul>
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
  );
};

export default GenrePage;

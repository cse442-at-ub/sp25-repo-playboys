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
  const [activeTrackUrl, setActiveTrackUrl] = useState<string | null>(null);
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
        setActiveTrackUrl(result.embedUrl);
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
        const response = await fetch(`http://localhost/backend/genreTopItems.php?genre=${genre}`);
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
    <div className="genre-page">
      <Sidebar />
      <div className="genre-content">
        <h1 className="genre-title">
          {genre ? genre.charAt(0).toUpperCase() + genre.slice(1) : "Genre"}
        </h1>
        <p className="genre-description">
          Explore the best in {genre} music—discover top tracks, albums, and artists.
        </p>

        {error && <p className="text-danger">{error}</p>}

        <h2 className="section-header">🎵 Top Songs</h2>
        <ul className="song-list">
          {songs.map((song, index) => (
            <li key={index} className="song"
              onClick={() => handleSongClick(song.name, song.artist)}
              style={{ cursor: "pointer" }}
              >
              {song.name} by {song.artist}
            </li>
          ))}
        </ul>

        <h2 className="section-header">🌟 Top Artists</h2>
        <ul className="artist-list">
          {artists.map((artist, index) => (
            <li key={index} className="artist"
            onClick={() => handleArtistClick(artist)}
              style={{ cursor: "pointer" }}>
              {artist}
            </li>
          ))}
        </ul>
      </div>
      {activeTrackUrl && (
        <SpotifyPlayer
          trackUrl={activeTrackUrl}
          onClose={() => setActiveTrackUrl(null)}
        />
      )}
    </div>
  );
};

export default GenrePage;

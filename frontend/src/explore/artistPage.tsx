import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../user_profile/Sidebar';
import SpotifyPlayer from "../spotify_player/SpotifyPlayer";
import './artistPage.css';


const ArtistPage: React.FC = () => {
  const { artist } = useParams<{ artist: string }>();
  const [topSongs, setTopSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTrack, setActiveTrack] = useState<{ url: string; title: string; artist: string } | null>(null);
  const [artistImage, setArtistImage] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (artist) { // Fetch top songs
      fetch(`${process.env.REACT_APP_API_URL}backend/artistTopSongs.php?artist=${artist}`)
        .then(response => response.json()).then(data => {
          if (data.status === 'success') {
            setTopSongs(data.topSongs);
          } else {
            console.error("Error fetching top songs:", data.message);
          } setLoading(false);
        }).catch(err => {
          console.error("Error fetching artist songs", err);
          setLoading(false);
        });

      // Fetch artist picture from Spotify
      fetch(`${process.env.REACT_APP_API_URL}backend/getArtistPic.php?artist=${artist}`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            setArtistImage(data.imageUrl);
            // Assuming your PHP returns the URL in data.imageUrl
          } else {
            console.error("Error fetching artist image:", data.message);

          }
        })
        .catch(err => {
          console.error("Error fetching artist image", err);

        });

    }
  }, [artist]);


  function formatDuration(duration: number): string {
    const totalSeconds = Math.floor(duration / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

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
        console.log(result)
        // Save track URL along with song title and artist name
        setActiveTrack({ url: result.trackUrl, title: song, artist: artist });
      } else {
        setNotification("Song not available");
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error("Error playing song:", error);
    }
  };


  return (
    <div className="ap-artist-page"> <Sidebar />
      {notification && (
        <div className="ap-notification">
          {notification}
        </div>
      )}
      <div className="ap-artist-content">
        <div className="ap-artist-header">
          {artistImage && (<img src={artistImage}
            alt={`${artist} image`} className="ap-artist-picture" />)}
          <h1 className="ap-artist-title">
            {artist ? artist.charAt(0).toUpperCase() + artist.slice(1) : "Artist"}
          </h1>
        </div>
        <h2 className="ap-top-songs-title">Top Songs</h2>
        {loading ? (<p>Loading...</p>) : (
          <ul className="ap-songs-list">
            {topSongs.map((song, index) => (
              <li key={index} className="ap-song-item" onClick={() => handleSongClick(song.name, artist || "")}>
                <span className="ap-song-name">{song.name}</span>
                <span className="ap-song-duration">{formatDuration(song.duration)}</span>
              </li>
            ))}
          </ul>)}
      </div>
      {activeTrack && (
        <SpotifyPlayer
          trackUrl={activeTrack.url}
          title={activeTrack.title}
          artist={activeTrack.artist}
          onClose={() => setActiveTrack(null)}
        />
      )}
    </div>);
};


export default ArtistPage;

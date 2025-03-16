import React, { useState } from 'react';
import './SpotifyPlayer.css';

const SpotifyPlayer: React.FC = () => {
  // Default to a sample track; change this to any valid embed URL. (you should totally play this)
  const [spotifyUrl, setSpotifyUrl] = useState<string>('https://open.spotify.com/embed/track/4uLU6hMCjMI75M1A2tKUQC?t=44s&autoplay=0');
  const [inputUrl, setInputUrl] = useState<string>('');

  // When the form is submitted, process the input URL and update the embed URL.
  const handleLoadTrack = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputUrl.trim() !== '') {
      let embedUrl = inputUrl;
      setSpotifyUrl(embedUrl);
    }
  };

  return (
    <div className="spotify-player-container">
      <iframe
        src={spotifyUrl}
        width="500"
        height="150"
        allow="encrypted-media"
        title="Spotify Player"
      ></iframe>
    </div>
  );
};

export default SpotifyPlayer;

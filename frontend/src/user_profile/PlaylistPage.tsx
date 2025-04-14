import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Sidebar from '../user_profile/Sidebar';
import SpotifyPlayer from "../spotify_player/SpotifyPlayer";
import './playlistPage.css';

const PlaylistPage: React.FC = () => {
    const { playlistName } = useParams<{ playlistName: string }>();
    // Extract username from the query string: e.g. ?user=usernameValue
    const [searchParams] = useSearchParams();
    const username = searchParams.get("user") || "";

    const [tracks, setTracks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTrack, setActiveTrack] = useState<{ url: string; title: string; artist: string } | null>(null);
    const [playlistImage, setPlaylistImage] = useState<string | null>(null);

    useEffect(() => {
        if (playlistName && username) {
            // Fetch playlist tracks with the username parameter
            fetch(`${process.env.REACT_APP_API_URL}backend/playlistTracks.php?playlist=${playlistName}&username=${username}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        setTracks(data.tracks);
                        console.log(data.tracks)
                    } else {
                        console.error("Error fetching tracks:", data.message);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching playlist tracks", err);
                    setLoading(false);
                });

            // Fetch the playlist image
            fetch(`${process.env.REACT_APP_API_URL}backend/getPlaylistPic.php?playlist=${playlistName}&username=${username}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        setPlaylistImage(data.imageUrl);
                    } else {
                        console.error("Error fetching playlist image:", data.message);
                    }
                })
                .catch(err => {
                    console.error("Error fetching playlist image", err);
                });
        }
    }, [playlistName, username]);

    // Helper function to format track duration (assumes duration in milliseconds)
    function formatDuration(duration: number): string {
        const totalSeconds = Math.floor(duration / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Handler for clicking on a track to play it
    const handleTrackClick = async (song: string, artist: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/playSong.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ song_name: song, artist_name: artist })
            });

            const result = await response.json();
            if (result.status === 'success') {
                // Set the active track with the returned track URL, song title, and artist name
                setActiveTrack({ url: result.trackUrl, title: song, artist: artist });
            } else {
                console.error("Error playing track:", result.message);
            }
        } catch (error) {
            console.error("Error playing track:", error);
        }
    };

    return (
        <div className="pp-playlist-page">
            <Sidebar />
            <div className="pp-playlist-content">
                <div className="pp-playlist-header">
                    {playlistImage && (
                        <img
                            src={playlistImage}
                            alt={`${playlistName} cover`}
                            className="pp-playlist-picture"
                        />
                    )}
                    <h1 className="pp-playlist-title">
                        {playlistName ? playlistName.charAt(0).toUpperCase() + playlistName.slice(1) : "Playlist"}
                    </h1>
                </div>
                <h2 className="pp-top-tracks-title">Tracks</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <ul className="pp-tracks-list">
                        {tracks.map((track, index) => (
                            <li key={index} className="pp-track-item" onClick={() => handleTrackClick(track.song, track.artist)}>
                                <span className="pp-track-name">{track.song}</span>
                                {track.duration && (
                                    <span className="pp-track-duration">{formatDuration(track.duration)}</span>
                                )}
                            </li>
                        ))}

                    </ul>
                )}
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

export default PlaylistPage;

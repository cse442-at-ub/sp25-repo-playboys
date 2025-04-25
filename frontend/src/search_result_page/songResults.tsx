import React, { useState, useRef } from "react";
import './SearchResultPage.css';
import SpotifyPlayer from '../spotify_player/SpotifyPlayer';

interface Song {
    album: string;
    artists_names: string | string[];
    duration: string;
    image_url: string;
    name: string;
    popularity: number;
    type: string;
    // Note: spotify_url will be fetched dynamically
}

const SongResults = ({ data }: { data: Song[] }) => {
    const songs: Song[] = data;
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [trackUrl, setTrackUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSongClick = async (song: Song): Promise<void> => {
        setSelectedSong(song);
        setLoading(true);

        // Determine artist parameter: first element if array,
        // or split string on comma to take first artist if comma exists
        let artistParam: string;
        if (Array.isArray(song.artists_names)) {
            artistParam = song.artists_names[0];
        } else {
            const nameStr = song.artists_names;
            artistParam = nameStr.includes(',')
                ? nameStr.split(',')[0].trim()
                : nameStr;
        }

        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}backend/playSong.php`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        song_name: song.name,
                        artist_name: artistParam,
                    }),
                }
            );
            const json = await res.json();
            if (json.status === 'success' && json.trackUrl) {
                setTrackUrl(json.trackUrl);
            } else {
                console.error('Error fetching track:', json.message || json);
                setSelectedSong(null);
            }
        } catch (err) {
            console.error('Error fetching track URL:', err);
            setSelectedSong(null);
        } finally {
            setLoading(false);
        }
    };

    const closePlayer = () => {
        setSelectedSong(null);
        setTrackUrl("");
    };

    const handleScrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 140, behavior: 'smooth' });
        }
    };

    const handleScrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -140, behavior: 'smooth' });
        }
    };

    return (
        <div
            className="song-results-horizontal-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h2 className="song-results-title">Song Results</h2>

            {songs.length === 0 ? (
                <p>No songs were found</p>
            ) : (
                <>
                    <div
                        className="song-results-horizontal-scroll"
                        ref={scrollContainerRef}
                    >
                        {songs.map((song, index) => (
                            <SongItem key={index} song={song} onClick={handleSongClick} />
                        ))}
                    </div>

                    {isHovered && songs.length > 0 && (
                        <>
                            <div className="scroll-arrow left" onClick={handleScrollLeft}>
                                ←
                            </div>
                            <div className="scroll-arrow right" onClick={handleScrollRight}>
                                →
                            </div>
                        </>
                    )}
                </>
            )}

            {loading && <div className="loading-spinner">Loading song...</div>}

            {selectedSong && trackUrl && !loading && (
                <SpotifyPlayer
                    trackUrl={trackUrl}
                    title={selectedSong.name}
                    artist={
                        Array.isArray(selectedSong.artists_names)
                            ? selectedSong.artists_names.join(', ')
                            : selectedSong.artists_names
                    }
                    onClose={closePlayer}
                />
            )}
        </div>
    );
};

const SongItem = ({ song, onClick }: { song: Song; onClick: (song: Song) => void }) => {
    const displayArtist = Array.isArray(song.artists_names)
        ? song.artists_names.join(', ')
        : song.artists_names;

    return (
        <button
            className="song-item-horizontal"
            onClick={() => onClick(song)}
        >
            <img
                src={song.image_url}
                alt={`${song.name} cover`}
                className="song-image-horizontal"
            />
            <h3 className="song-title">{song.name}</h3>
            <p className="song-artist">{displayArtist}</p>
        </button>
    );
};

export default SongResults;

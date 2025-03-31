import React, { useState, useRef } from "react";
import './SearchResultPage.css';

interface Song {
    album: string;
    artists_names: string[];
    duration: string;
    image_url: string;
    name: string;
    popularity: number;
    spotify_url: string;
    type: string;
}


const SongResults = ({ data }: { data: Song[] }) => {

    const songs: Song[] = data;   
    console.log(songs);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleSongClick = (song: Song): void => {
        console.log(`Song clicked: ${song.name} by ${song.artists_names}`);
    };

    // Function to handle scrolling right
    const handleScrollRight = () => {
        if (scrollContainerRef.current) {
            const itemWidth = 140; // Width of each song item
            scrollContainerRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
    };

    // Function to handle scrolling left
    const handleScrollLeft = () => {
        if (scrollContainerRef.current) {
            const itemWidth = 140; // Width of each song item
            scrollContainerRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
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
                    <div className="song-results-horizontal-scroll" ref={scrollContainerRef}>
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

        </div>
    );
};

const SongItem = ({ song, onClick }: { song: Song; onClick: (song: Song) => void }) => {
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
                <p className="song-artist">{song.artists_names}</p>
        </button>
    );
};

export default SongResults;




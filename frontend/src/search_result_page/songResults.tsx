import React, { useState, useRef } from "react";
import './SearchResultPage.css';

interface Song {
    title: string;
    artist: string;
    image: string;
}

const SongResults = () => {
    const [songs] = useState<Song[]>([
        { title: "Song 1", artist: "Artist 1", image: './static/Drakepfp.png' },
        { title: "Song 2", artist: "Artist 2", image: './static/Adopfp.png' },
        { title: "Song 3", artist: "Artist 3", image: './static/TheBeatlespfp.png' },
        { title: "Song 4", artist: "Artist 4", image: './static/Drakepfp.png' },
        { title: "Song 5", artist: "Artist 5", image: './static/Adopfp.png' },
        { title: "Song 6", artist: "Artist 6", image: './static/TheBeatlespfp.png' },
        { title: "Song 7", artist: "Artist 7", image: './static/Drakepfp.png' },
        { title: "Song 8", artist: "Artist 8", image: './static/Adopfp.png' },
        { title: "Song 9", artist: "Artist 9", image: './static/TheBeatlespfp.png' },
        { title: "Song 10", artist: "Artist 10", image: './static/Drakepfp.png' },
        { title: "Song 11", artist: "Artist 11", image: './static/Adopfp.png' },
        { title: "Song 12", artist: "Artist 12", image: './static/TheBeatlespfp.png' },
        { title: "Song 13", artist: "Artist 13", image: './static/Drakepfp.png' },
        { title: "Song 14", artist: "Artist 14", image: './static/Adopfp.png' },
        { title: "Song 15", artist: "Artist 15", image: './static/TheBeatlespfp.png' },
    ]);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleSongClick = (song: Song): void => {
        console.log(`Song clicked: ${song.title} by ${song.artist}`);
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
                src={song.image}
                alt={`${song.title} cover`}
                className="song-image-horizontal"
            />
            <div className="song-details">
                <h3 className="song-title">{song.title}</h3>
                <p className="song-artist">{song.artist}</p>
            </div>
        </button>
    );
};

export default SongResults;




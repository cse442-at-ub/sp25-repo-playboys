import React, { useState, useRef } from "react";
import './SearchResultPage.css';

interface Artist {
    name: string;
    image: string;
}

const ArtistResults = () => {
    const [artists] = useState<Artist[]>([
        { name: "Artist 1", image: './static/Drakepfp.png' },
        { name: "Artist 2", image: './static/Adopfp.png' },
        { name: "Artist 3", image: './static/TheBeatlespfp.png' },
        { name: "Artist 4", image: './static/Drakepfp.png' },
        { name: "Artist 5", image: './static/Adopfp.png' },
        { name: "Artist 6", image: './static/TheBeatlespfp.png' },
        { name: "Artist 7", image: './static/Drakepfp.png' },
        { name: "Artist 8", image: './static/Adopfp.png' },
        { name: "Artist 9", image: './static/TheBeatlespfp.png' },
        { name: "Artist 10", image: './static/Drakepfp.png' },
        { name: "Artist 11", image: './static/Adopfp.png' },
        { name: "Artist 12", image: './static/TheBeatlespfp.png' },
        { name: "Artist 13", image: './static/Drakepfp.png' },
        { name: "Artist 14", image: './static/Adopfp.png' },
        { name: "Artist 15", image: './static/TheBeatlespfp.png' },
    ]);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleArtistClick = (artist: Artist): void => {
        console.log(`Artist clicked: ${artist.name}`);
    };

    const handleScrollRight = () => {
        if (scrollContainerRef.current) {
            const itemWidth = 140; // Width of each artist item
            scrollContainerRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
    };

    const handleScrollLeft = () => {
        if (scrollContainerRef.current) {
            const itemWidth = 140; // Width of each artist item
            scrollContainerRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        }
    };

    return (
        <div
            className="artist-results-horizontal-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h2 className="artist-results-title">Artist Results</h2>
            {artists.length === 0 ? (
                <p> No Artists were found</p>
            ): (
                <>
                    <div className="artist-results-horizontal-scroll" ref={scrollContainerRef}>
                        {artists.map((artist, index) => (
                            <ArtistItem key={index} artist={artist} onClick={handleArtistClick} />
                        ))}
                    </div>
                    {isHovered && (
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

const ArtistItem = ({ artist, onClick }: { artist: Artist; onClick: (artist: Artist) => void }) => {
    return (
        <button
            className="artist-item-horizontal"
            onClick={() => onClick(artist)}
        >
            <img
                src={artist.image}
                alt={`${artist.name} image`}
                className="artist-image-horizontal"
            />
            <div className="artist-details">
                <h3 className="artist-name">{artist.name}</h3>
            </div>
        </button>
    );
};

export default ArtistResults;
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import './SearchResultPage.css';

interface Artist {
    followers :number,
    genres: string[],
    image_url: string,
    name: string,
    popularity: number, 
}

const ArtistResults = ({ data }: {data: Artist[]}) => {

    const artists: Artist[] = data;
    const navigate = useNavigate();
   

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleArtistClick = (artist: Artist): void => {
        navigate(`/explore/artist/${artist.name.toLowerCase()}`);
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
                src={artist.image_url}
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
import React, { useState, useRef } from "react";
import './SearchResultPage.css';

interface Community {
    name: string;
    image: string;
}

const CommunityResults = () => {
    const [communities] = useState<Community[]>([
        { name: "Long ass name for testing", image: './static/Drakepfp.png' },
        { name: "Community 2", image: './static/Drakepfp.png' },
        { name: "Community 3", image: './static/Drakepfp.png' },
        { name: "Community 4", image: './static/Drakepfp.png' },
        { name: "Community 5", image: './static/Drakepfp.png' },
        { name: "Community 6", image: './static/Drakepfp.png' },
        { name: "Community 7", image: './static/Drakepfp.png' },
        { name: "Community 8", image: './static/Drakepfp.png' },
        { name: "Community 9", image: './static/TheBeatlespfp.png' },
        { name: "Community 10", image: './static/TheBeatlespfp.png' },
        { name: "Community 11", image: './static/TheBeatlespfp.png' },
        { name: "Community 12", image: './static/Community12.png' },
        { name: "Community 13", image: './static/Community13.png' },
        { name: "Community 14", image: './static/Community14.png' },
        { name: "Long ass name for testing", image: './static/Community15.png' },
    ]);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleCommunityClick = (community: Community): void => {
        console.log(`Community clicked: ${community.name}`);
    };

    const handleScrollRight = () => {
        if (scrollContainerRef.current) {
            const itemWidth = 140; // Width of each community item
            scrollContainerRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
    };

    const handleScrollLeft = () => {
        if (scrollContainerRef.current) {
            const itemWidth = 140; // Width of each community item
            scrollContainerRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        }
    };

    return (
        <div
            className="community-results-horizontal-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h2 className="community-results-title">Community Results</h2>
            {communities.length === 0 ? (
                <p>No Communities were found</p>
            ) : (
                <>
                    <div className="community-results-horizontal-scroll" ref={scrollContainerRef}>
                        {communities.map((community, index) => (
                            <CommunityItem key={index} community={community} onClick={handleCommunityClick} />
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

const CommunityItem = ({ community, onClick }: { community: Community; onClick: (community: Community) => void }) => {
    return (
        <button
            className="community-item-horizontal"
            onClick={() => onClick(community)}
        >
            <img
                src={community.image}
                alt={`${community.name} image`}
                className="community-image-horizontal"
            />
            <div className="community-details">
                <h3 className="community-name">{community.name}</h3>
            </div>
        </button>
    );
};

export default CommunityResults;

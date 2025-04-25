import React, { useState, useRef, useEffect } from "react";
import { useCSRFToken } from '../csrfContent';
import { useNavigate } from "react-router-dom";

interface Community {
    name: string;
    background_image: string;
}

const CommunityResults = ({ query }: { query: string }) => {
    const [communities, setCommunities] = React.useState<Community[]>([]);
    const { csrfToken } = useCSRFToken();
    const navigate = useNavigate();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Levenshtein Distance Function
    function levenshtein(a: string, b: string): number {
        const dp = Array.from({ length: a.length + 1 }, () =>
            new Array(b.length + 1).fill(0)
        );

        for (let i = 0; i <= a.length; i++) dp[i][0] = i;
        for (let j = 0; j <= b.length; j++) dp[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j],     // deletion
                        dp[i][j - 1],     // insertion
                        dp[i - 1][j - 1]  // substitution
                    ) + 1;
                }
            }
        }

        return dp[a.length][b.length];
    }

    useEffect(() => {
        const fetchCommunities = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/getAllcomms.php`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'CSRF-Token': csrfToken }
            });

            const data = await response.json();

            // Filter communities based on Levenshtein similarity
            const filtered = data
                .map((community: any) => {
                    const distance = levenshtein(query.toLowerCase(), community.community_name.toLowerCase());
                    const maxLen = Math.max(query.length, community.community_name.length);
                    const similarity = 1 - distance / maxLen;
                    return { ...community, similarity };
                })
                .filter((c: any) => c.similarity >= 0.4) // adjust threshold as needed
                .sort((a: any, b: any) => b.similarity - a.similarity);

            console.log(filtered);
            const formatted: Community[] = filtered.map((c: any) => ({
                name: c.community_name,
                background_image: c.picture
            }));
            console.log(formatted);
            setCommunities(formatted);
        };

        if (query.trim() !== "") {
            fetchCommunities();
        } else {
            setCommunities([]);
        }

    }, [query, csrfToken]);

    const handleScrollRight = () => {
        if (scrollContainerRef.current) {
            const itemWidth = 140;
            scrollContainerRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
    };

    const handleScrollLeft = () => {
        if (scrollContainerRef.current) {
            const itemWidth = 140;
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
                <div>
                    <button onClick={() => navigate(`/create-community`)}>
                        <p>No Communities were found, make your own</p>
                    </button>
                </div>
            ) : (
                <>
                    <div className="community-results-horizontal-scroll" ref={scrollContainerRef}>
                        {communities.map((community, index) => (
                            <CommunityItem key={index} community={community} onClick={() => navigate(`/community/${community.name}`)} />
                        ))}
                    </div>
                    {isHovered && (
                        <>
                            <div className="scroll-arrow left" onClick={handleScrollLeft}>←</div>
                            <div className="scroll-arrow right" onClick={handleScrollRight}>→</div>
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
                src={community.background_image}
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

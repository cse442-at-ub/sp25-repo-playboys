import React, { useState, useRef } from "react";
import { useCSRFToken } from '../csrfContent';


interface Artist {
    followers :number,
    genres: string[],
    image_url: string,
    name: string,
    popularity: number, 
}

const CommunityResults = ({ data }: {data: Artist[]}) => {

    const artists: Artist[] = data;

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const {csrfToken} = useCSRFToken();

    const handleCommunityClick = async(community: Artist) => {
        var response = await fetch(`${process.env.REACT_APP_API_URL}backend/getProfile.php`, {
            method: 'GET', // Or 'GET' depending on your API
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken
            },
        });
        var results = await response.json();
        if (results["status"] === "success") {
            var user = results["loggedInUser"];
            console.log(`user: ${user}`);
        } else {
            console.error("Error fetching profile:", results);
        }
        console.log(`Community clicked: ${community.name}`);
        console.log("creating community");
        var response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/create_comunity.php`, {
            method: 'POST', // Or 'GET' depending on your API
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken
            },
            body: JSON.stringify({
                "name": community.name,
                "image": community.image_url,
                "user": user
            })
        }); 
        var results = await response.json();
        console.log(results)

        console.log("checking if user is part of the commuitty");
        var response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/checkUser.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken
            },
            body: JSON.stringify({
                "name": community.name,
                "image": community.image_url,
                "user": user
            })
        }); 
        var results = await response.json();
        console.log(results)

        // ADDDING
        if (results === false) {
            // add user to community
            console.log("adding user to  community");
            var response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/join_community.php`, {
                method: 'POST', // Or 'GET' depending on your API
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken
                },
                body: JSON.stringify({
                    "name": community.name,
                    "image": community.image_url,
                    "user": user
                })
            });
            var results = await response.json();
            console.log(results)
            
            // add community to user profile
            console.log("adding community to profile");
            var response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/addcomtopfp.php`, {
                method: 'POST', // Or 'GET' depending on your API
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken
                },
                body: JSON.stringify({
                    "name": community.name,
                    "image": community.image_url,
                    "user": user
                })
            });
            var results = await response.json();
            console.log(results)
        }

        // REMOVING
        if (results === true) {
            // remove user to community
            console.log("removing user to  community");
            var response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/leave_community.php`, {
                method: 'POST', // Or 'GET' depending on your API
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken
                },
                body: JSON.stringify({
                    "name": community.name,
                    "image": community.image_url,
                    "user": user
                })
            });
            var results = await response.json();
            console.log(results)

            // reove community from user profile
            console.log("removing comm from pfp");
            var response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/removecomtopfp.php`, {
                method: 'POST', // Or 'GET' depending on your API
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken
                },
                body: JSON.stringify({
                    "name": community.name,
                    "image": community.image_url,
                    "user": user
                })
            });
            var results = await response.json();
            console.log(results)
        }
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
            {artists.length === 0 ? (
                <p>No Communities were found</p>
            ) : (
                <>
                    <div className="community-results-horizontal-scroll" ref={scrollContainerRef}>
                        {artists.map((artist, index) => (
                            <CommunityItem key={index} community={artist} onClick={handleCommunityClick} />
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

const CommunityItem = ({ community, onClick }: { community: Artist; onClick: (community: Artist) => void }) => {
    return (
        <button
            className="community-item-horizontal"
            onClick={() => onClick(community)}
        >
            <img
                src={community.image_url}
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

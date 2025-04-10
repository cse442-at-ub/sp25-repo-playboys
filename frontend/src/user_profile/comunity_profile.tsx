import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCSRFToken } from '../csrfContent';

interface Community {
  id: number;
  name: string;
}

const CommunityResultsProfile = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const { csrfToken } = useCSRFToken();

  useEffect(() => {
    const fetchJoinedCommunities = async () => {
      try {
        const profileRes = await fetch(`${process.env.REACT_APP_API_URL}backend/getProfile.php`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken
          },
          credentials: 'include'
        });
        const profileData = await profileRes.json();
        const username = profileData.loggedInUser;
    
        const res = await fetch(`${process.env.REACT_APP_API_URL}backend/custom_communities/getJoinedCommunities.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken
          },
          credentials: 'include',
          body: JSON.stringify({ user: username })
        });
    
        const data = await res.json();
        if (data.status === "success") {
          setCommunities(data.communities);
        }
      } catch (error) {
        console.error("Error loading joined communities", error);
      }
    };
    

    fetchJoinedCommunities();
  }, [csrfToken]);

  return (
    <div>
      <h1>My Communities</h1>
      {communities.map((community) => (
        <div key={community.id}>
          <Link to={`/community/${community.id}`}>
            <p className="community-link">{community.name}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CommunityResultsProfile;

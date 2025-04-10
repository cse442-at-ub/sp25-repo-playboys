import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCSRFToken } from '../csrfContent';
import "./community_profile.css"
import { useNavigate } from "react-router-dom";

interface Community {
  id: number;
  name: string;
  background_image: string;
}

const CommunityResultsProfile = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const { csrfToken } = useCSRFToken();
  const navigate = useNavigate();

  const defaultImage = process.env.PUBLIC_URL + "/static/PlayBoysBackgroundImage169.jpeg";

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
      <div className="ep-community-circle-row ">


          {communities.map((community) => (
            <div key={community.id} className="ep-community-wrapper" onClick={() => navigate(`/community/${community.id}`)}>
              <div
                className="ep-community-circle"
                style={{
                  backgroundImage: `url("${community.background_image?.startsWith("data:image") ? community.background_image : defaultImage}")`
                }}
              />
              <p className="ep-community-name">{community.name}</p>
            </div>
          ))}
        
    </div>
  </div>
  );
};

export default CommunityResultsProfile;

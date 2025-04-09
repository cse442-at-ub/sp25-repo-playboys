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
    const fetchCommunities = async () => {
      try {
        // Step 1: Get logged in user
        const profileRes = await fetch(`${process.env.REACT_APP_API_URL}backend/getProfile.php`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken,
          },
          credentials: 'include',
        });

        const profileData = await profileRes.json();
        if (profileData.status !== "success") {
          console.error("Could not fetch profile");
          return;
        }

        const user = profileData.loggedInUser;

        // Step 2: Fetch communities created by the user
        const commsRes = await fetch(`${process.env.REACT_APP_API_URL}backend/custom_communities/getCommunities.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken,
          },
          credentials: 'include',
          body: JSON.stringify({ user }),
        });

        const commsData = await commsRes.json();

        if (commsData.status === "success") {
          setCommunities(commsData.communities); // ✅ Update state
        } else {
          console.error("Unexpected response:", commsData);
        }
      } catch (err) {
        console.error("Error fetching communities", err);
      }
    };

    fetchCommunities();
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

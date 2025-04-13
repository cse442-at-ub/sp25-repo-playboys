import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCSRFToken } from '../csrfContent';
import "./community_profile.css"
import { useNavigate } from "react-router-dom";
import { get } from "jquery";
import { px } from "framer-motion";

interface Community {
  name: string;
  background_image: string;
  id: number;
}

const CommunityResultsProfile = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const { csrfToken } = useCSRFToken();
  const navigate = useNavigate();

  const defaultImage = process.env.PUBLIC_URL + "/static/PlayBoysBackgroundImage169.jpeg";

  useEffect(() => {
    const verifyUserSession = async () => {
      const profileRes = await fetch(`${process.env.REACT_APP_API_URL}backend/getProfile.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
      });
      const profileData = await profileRes.json();
      if (profileData.status !== 'success') {
        return "error";
      }
      return profileData.loggedInUser;
    }

    // returns a list of strings of the communities the user is in
    const getUserCommunities = async (username: string) => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/getcomms.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ "user": username })
      });
      const data = await res.json();
      return data
    }

    // gets the counities data from the backend and sets the state of the communities
    const getCommunityData = async (communityNames: string[]) => {
      const communityDataList: Community[] = [];
    
      for (const communityName of communityNames) {
        console.log("Fetching data for", communityName);
    
        const res = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/getCommInfo.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken,
          },
          credentials: 'include',
          body: JSON.stringify({ name: communityName }),
        });
    
        const data = await res.json();
        console.log("Raw response from getCommInfo:", data);
        communityDataList.push({
          name: data.community_name,
          background_image: data.picture || defaultImage,
          id: data.id,
        });
    }
    console.log("Community data list:", communityDataList);
    setCommunities(communityDataList);
  };

    const CallThe3FunctionsIJustmade = async () => {
      const username = await verifyUserSession();
      if (username !== "error") {
        const comms = await getUserCommunities(username);
        console.log("User is in communities:", comms); // <- Check this!

        await getCommunityData(comms);
      }
    }


    CallThe3FunctionsIJustmade();
  
  }, [csrfToken]);

  return (
    <div>
      <h1>My Communities</h1>
      <div className="ep-community-circle-row ">
          {communities.map((community) => (
            console.log(community),
            <div key={community.id} className="ep-community-wrapper" onClick={() => navigate(`/community/${community.name}`)}>
              {/* <div
                className="ep-community-circle"
                style={{
                  backgroundImage: `url("${community.background_image?.startsWith("data:image") ? community.background_image : defaultImage}")`
                }}
              /> */}
              <img src={community.background_image} style={{width:75}}></img>
              <p className="ep-community-name">{community.name}</p>
            </div>
          ))}
        
    </div>
  </div>
  );
};

export default CommunityResultsProfile;

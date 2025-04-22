import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCSRFToken } from '../csrfContent';
import "./community_profile.css"
import { useNavigate, useSearchParams } from "react-router-dom";

interface Community {
  name: string;
  background_image: string;
  id: number;
}

const CommunityResultsProfile = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchParams] = useSearchParams();
  const user = searchParams.get("user") || "";
  const [username, setUsername] = useState("");
  const { csrfToken } = useCSRFToken();
  const navigate = useNavigate();

  const defaultImage = process.env.PUBLIC_URL + "/static/PlayBoysBackgroundImage169.jpeg";

  useEffect(() => {
    const verifyUserSession = async () => {
      const profileRes = await fetch(`${process.env.REACT_APP_API_URL}backend/getProfile.php?user=${user || ""}`, {
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
      return profileData.profile.username;
    }
    const fetchUsername = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/usernameGrabber.php`, {
          method: "GET",
          credentials: "include",
          headers: { 'CSRF-Token': csrfToken }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.login_user) {
            setUsername(data.login_user);

           
          }
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
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
      console.log("Fetching communities from:", res);
      return data
    }

    // gets the communities data from the backend and sets the state of the communities
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

    fetchUsername();
    CallThe3FunctionsIJustmade();

  }, [user]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"> {/* Header with button */}
        <h2 className="h3 fw-bold mb-0">
          {username === user || user === "" ? (
                  "My Communities"
                ) : (
                  `${user}'s Communities`
          )}
          </h2> {/* Consistent title style can be applied in UserProfile if needed */}
          {username === user || user === "" ? (
            <a
              href="#/create-community"
              className="btn btn-success rounded-circle d-flex justify-content-center align-items-center p-0"
              style={{ width: '32px', height: '32px', fontSize: '1.2em' }}
              aria-label="Create new community"
            >
              +
            </a>
          ): null }
      </div>
      <div className="ep-community-circle-row">
        {communities.map((community) => (
          console.log(community),
          <div key={community.id} className="ep-community-wrapper" onClick={() => navigate(`/community/${community.name}`)}>
            <img
              src={community.background_image}
              className="community-circle-image"
              alt={community.name}
            />
            <p className="ep-community-name">{community.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityResultsProfile;
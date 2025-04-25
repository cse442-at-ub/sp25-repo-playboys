import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCSRFToken } from '../csrfContent';
import "./community_profile.css"

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollArrows, setShowScrollArrows] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const defaultImage = process.env.PUBLIC_URL + "/static/PlayBoysBackgroundImage169.jpeg";

  useEffect(() => {
    const checkScroll = () => {
      if (containerRef.current) {
        setShowScrollArrows(containerRef.current.scrollWidth > containerRef.current.clientWidth);
      }
    };

    checkScroll();

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', checkScroll);
    }

    window.addEventListener('resize', checkScroll);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [communities]);

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

  }, [user, csrfToken]);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 200;
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 200;
    }
  };

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
          <Link
            to="/create-community"
            className="btn btn-success rounded-circle d-flex justify-content-center align-items-center p-0"
            style={{ width: '32px', height: '32px', fontSize: '1.2em' }}
            aria-label="Create new community"
          >
            +
          </Link>
        ): null }
      </div>
      <div className="position-relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          className="ep-community-circle-row"
          ref={containerRef}
          style={{
            justifyContent: 'flex-start',
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingBottom: '10px',
            gap: '15px', // Adjust gap as needed
          }}
        >
          {communities.map((community) => (
            <div
              key={community.id}
              className="ep-community-wrapper"
              onClick={() => navigate(`/community/${community.name}`)}
              style={{
                minWidth: '120px', // Adjust as needed
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <img
                src={community.background_image}
                className="community-circle-image"
                alt={community.name}
                style={{
                  width: '100px', // Adjust as needed
                  height: '100px', // Adjust as needed
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '5px',
                }}
              />
              <p className="ep-community-name" style={{
                fontSize: '0.9em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100px', // Match the image width
                margin: '0 auto',
              }}>{community.name}</p>
            </div>
          ))}
        </div>
        {showScrollArrows && isHovering && (
          <>
            <div
              className="scroll-arrow-compact left-compact"
              onClick={scrollLeft}
              aria-label="Scroll left"
              style={{
                position: 'absolute',
                top: '50%',
                left: '0px',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.7)',
                padding: '5px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.5em',
                zIndex: 10,
              }}
            >
              ←
            </div>
            <div
              className="scroll-arrow-compact right-compact"
              onClick={scrollRight}
              aria-label="Scroll right"
              style={{
                position: 'absolute',
                top: '50%',
                right: '0px',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.7)',
                padding: '5px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.5em',
                zIndex: 10,
              }}
            >
              →
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommunityResultsProfile;
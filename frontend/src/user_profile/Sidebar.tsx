import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCSRFToken } from '../csrfContent';
import { useSidebar } from "../SidebarContext";

interface Friend {
  name: string;
  image: string;
}

interface Event {
  title: string;
  image: string;
  id: string;
}

interface Community {
  name: string;
  background_image: string;
  id: number;
}

function Sidebar() {
  const [searchParams] = useSearchParams();
  const user = searchParams.get("user");
  const navigate = useNavigate();
  const { isOpen, toggleSidebar  } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("Explore");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const { csrfToken } = useCSRFToken();
  const [communityDataList, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => { 
 
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/events/joinedEvents.php`, {
          method: "GET",
          credentials: "include",
          headers: {"page-source": "sidebar", 'CSRF-Token': csrfToken },
  
        });
        const result = await response.json();
        if(result.status === "success"){
          setEvents(result.data);
        } else {
          console.log("no events found for you");
        }
      } catch (error){
        console.error("Error fetching events");
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/friendList.php`, {
          method: "POST",
          credentials: "include",
          headers: { 'page-source': "sidebar", 'CSRF-Token': csrfToken },
        });

        if (response.ok) {
          const data = await response.json();
          if (!data.includes("error")) {
            setFriends(data);
          }
        } else {
          console.error("Error fetching friends:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

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
        console.log("Fetching communities from:", res);
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
            background_image: data.picture,
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

  const menuItems = [
    { icon: "./static/ExploreIcon.png", text: "Explore", handleClick: () => navigate('/explore') },
    { icon: "./static/StatisticIcon.png", text: "My Stat", handleClick: () => navigate('/statistics') },
    { icon: "./static/ProfileIcon.png", text: "My Profile", handleClick: () => window.location.href = "#/userprofile" },
    { icon: "./static/SearchIcon.png", text: "Search", handleClick: () => window.location.href = "#/search_results" },
    { icon: "./static/SettingIcon.png", text: "Setting", handleClick: () => window.location.href = "#/settings" },
  ];

  if (isMobile) {
    return (
      <div className="fixed-bottom bg-white d-flex justify-content-around p-2" style={{ borderTop: "1px solid #ddd", zIndex: 1051 }}>
        {menuItems.slice(0, 2).map((item, index) => (
          <button
            key={index}
            className={`btn ${activeTab === item.text ? "text-primary" : "text-secondary"}`}
            onClick={item.handleClick}
          >
            <img src={item.icon} className="d-block mx-auto" style={{ width: "30px", height: "30px" }} alt={item.text} />
            <span className="d-block" style={{ fontSize: "12px" }}>{item.text}</span>
          </button>
        ))}
        {menuItems.slice(2).map((item, index) => (
          <button key={index} className={`btn ${activeTab === item.text ? "text-primary" : "text-secondary"}`} onClick={item.handleClick}>
            <img src={item.icon} className="d-block mx-auto" style={{ width: "30px", height: "30px" }} alt={item.text} />
            <span className="d-block" style={{ fontSize: "12px" }}>{item.text}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className="d-flex flex-column"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100vh",
        width: isOpen ? "250px" : "60px",
        backgroundColor: "#fff",
        borderLeft: "2px solid gray",
        transition: "width 0.3s ease-in-out",
        overflowX: "hidden",
        zIndex: 1049,
      }}
    >
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "#04dd4b",
          height: "80px",
          cursor: "pointer",
        }}
        onClick={toggleSidebar}
      >
        <img
          src={process.env.PUBLIC_URL + "/static/logo.jpg"}
          alt="Logo"
          style={{
            height: "60px",
            width: isOpen ? "auto" : "30px",
            objectFit: "contain",
            transition: "width 0.3s ease-in-out"
          }}
        />
      </div>

      {isOpen && (
        <>
          <SidebarSection title="Friends" friends={friends} user={user || ''} />
          <SidebarSection title="Events" events={events} />
          <SidebarSection title="Communities" communities={communityDataList} />
          <hr className="my-4 border-3" style={{ width: "100%", margin: "auto" }} />
        </>
      )}

      {menuItems.map((item, index) => (
        <MenuItem key={index} icon={item.icon} text={item.text} handleClick={item.handleClick} isOpen={isOpen} />
      ))}
    </div>
  );
}

function SidebarSection({ title, count, friends, events, user, communities }: { title: string; count?: number; friends?: Friend[]; events?: Event[]; user?: string, communities?: Community[] }) {
  const navigate = useNavigate();
  const handleFriendClick = (friendName: string) => {
    navigate(`/userprofile?user=${friendName || ""}`);
  };
  const handleEventClick = (id: string) =>{
    navigate(`/event?id=${id}`);
  };

  return (
    <div className="mb-4 px-3">
      <div className="d-flex justify-content-between align-items-center">
        <h4 style={{ fontSize: "16px" }}>{title}</h4>
        {title === "Friends" && (
          <button className="btn btn-link text-primary p-0" style={{ fontSize: "12px" }} onClick={() => window.location.href = "#/friendlist"}>
            Show All
          </button>
        )}
      </div>
      <div className="d-flex flex-wrap gap-2">
        {title === "Friends" && friends && friends.length > 0 ? (
          friends.map((friend, i) => (
            <div key={i} className="text-center">
              <img
                src={friend.image || "./static/ProfilePlaceholder.png"}
                alt={friend.name}
                className="rounded-circle"
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                onClick={() => handleFriendClick(friend.name)}
                onError={(e) => (e.currentTarget.src = "./static/ProfilePlaceholder.png")}
              />
              <div style={{ fontSize: "12px", cursor: "pointer" }} onClick={() => handleFriendClick(friend.name)}>
                {friend.name}
              </div>
            </div>
          ))
        ) : title === "Events" && events && events.length > 0 ? (
          /* Events Section */
          events.map((event, i) => (
            <div key={i} className="text-center">
              <img
                src={event.image || "./static/EventPlaceholder.png"}
                alt={event.title}
                className="rounded-circle"
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                onClick={() => handleEventClick(event.id)}
                onError={(e) => (e.currentTarget.src = "./static/EventPlaceholder.png")}
              />
              <div style={{ fontSize: "12px", cursor: "pointer" }} onClick={() => handleEventClick(event.id)}>
                {event.title}
              </div>
            </div>
          ))
        ) : title === "Communities" && communities && communities.length > 0 ? (
          /* Communities Section */
          communities.map((community, i) =>(
            <div key={i} className="text-center">
              <img
                src={community.background_image || "./static/EventPlaceholder.png"}
                alt={community.name}
                className="rounded-circle"
                style={{ width: "50px", height: "50px", cursor: "pointer" }}
                onClick={() => navigate(`/community/${community.name}`)}
                onError={(e) => (e.currentTarget.src = "./static/EventPlaceholder.png")}
              />
              <div style={{ fontSize: "12px", cursor: "pointer" }}>
                {community.name}
              </div>
            </div>
          ))
          ) : (
            <div style={{ fontSize: "12px", color: "gray" }}>No items to display</div>
          )}
        </div>
    </div>
  );
}

function MenuItem({ icon, text, handleClick, isOpen }: { icon: string; text: string; handleClick: () => void; isOpen: boolean }) {
  return (
    <button className="d-flex align-items-center mb-3 w-100 btn" style={{ border: "none", textAlign: "left" }} onClick={handleClick}>
      <img src={icon} className="mr-3 ml-2" style={{ width: "30px", height: "30px" }} alt={text} />
      {isOpen && <span style={{ fontSize: "20px" }}>{text}</span>}
    </button>
  );
}

export default Sidebar;

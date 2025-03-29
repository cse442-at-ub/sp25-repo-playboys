import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCSRFToken } from '../csrfContent';
interface Friend {
  name: string;
  image: string;
}

function Sidebar() {
  const [searchParams] = useSearchParams();
  const user = searchParams.get("user");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("Explore");
  const [friends, setFriends] = useState<Friend[]>([]);
  const { csrfToken } = useCSRFToken();
  // const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Fetch the friends list from the backend when the component mounts
    const fetchFriends = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/friendList.php`, {
          method: "POST",
          credentials: "include", // Include cookies for authentication if needed
          headers: { 'page-source': "sidebar",'CSRF-Token': csrfToken }, // Add CSRF token for security
        });
        
        if (response.ok) {
          const data = await response.json(); // Assuming the response contains the friends list
          if (data.includes("error")) {
            console.log("Error fetching friends or user not authenticated");
          } else {
            setFriends(data); // Populate the friends list
            console.log("successfully set data", data);
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
  

  const sections = [
    { title: "Community", count: 8 },
    { title: "My Artist", count: 8 },
  ];

  const menuItems = [
    { icon: "./static/ExploreIcon.png", text: "Explore", handleClick: () => navigate('/explore') },
    { icon: "./static/StatisticIcon.png", text: "My Stat", handleClick: () => console.log("My Stat clicked") },
    { icon: "./static/ProfileIcon.png", text: "My Profile", handleClick: () => window.location.href = "#/userprofile" },
    { icon: "./static/SettingIcon.png", text: "Setting", handleClick: () => window.location.href = "#/settings" },
  ];

  if (isMobile) {
    return (
      <div
        className="fixed-bottom bg-white d-flex justify-content-around p-2"
        style={{ borderTop: "1px solid #ddd", zIndex: 1051 }}
      >
        {menuItems.slice(0, 2).map((item, index) => (
          <button
            key={index}
            className={`btn ${activeTab === item.text ? "text-primary" : "text-secondary"}`}
            onClick={item.handleClick}
          >
            <img
              src={item.icon}
              className="d-block mx-auto"
              style={{ width: "30px", height: "30px" }}
              alt={item.text}
            />
            <span className="d-block" style={{ fontSize: "12px" }}>
              {item.text}
            </span>
          </button>
        ))}
        <button
          className={`btn ${activeTab === "Search" ? "text-primary" : "text-secondary"}`}
          onClick={() => setActiveTab("Search")}
        >
          <img
            src="./static/SearchIcon.png"
            className="d-block mx-auto"
            style={{ width: "30px", height: "30px" }}
            alt="Search"
          />
          <span className="d-block" style={{ fontSize: "12px" }}>
            Search
          </span>
        </button>
        {menuItems.slice(2).map((item, index) => (
          <button
            key={index}
            className={`btn ${activeTab === item.text ? "text-primary" : "text-secondary"}`}
            onClick={item.handleClick}
          >
            <img
              src={item.icon}
              className="d-block mx-auto"
              style={{ width: "30px", height: "30px" }}
              alt={item.text}
            />
            <span className="d-block" style={{ fontSize: "12px" }}>
              {item.text}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`sidebar ${isOpen || !isMobile ? "open" : ""}`}
      style={{ position: "fixed", top: 0, right: 0, width: isOpen || !isMobile ? "250px" : "0", height: "100vh", overflowY: "auto", borderLeft: "2px solid gray", backgroundColor: "#ffffff", flexDirection: "column", opacity: isOpen || !isMobile ? 1 : 0, transition: "width 0.3s ease-in-out, opacity 0.3s ease-in-out", zIndex: 1049 }}
    >
      <div className="bg-secondary text-white p-3 mb-4 text-center">
        <h3>Logo</h3>
      </div>
      <SidebarSection title="Friends" friends={friends} user={user || ''}/>
      {sections.map((section, index) => (
        <SidebarSection key={index} title={section.title} count={section.count} />
      ))}
      <hr className="my-4 border-3" style={{ width: "100%", margin: "auto" }} />
      {menuItems.map((item, index) => (
        <MenuItem key={index} icon={item.icon} text={item.text} handleClick={item.handleClick} />
      ))}
    </div>
  );
}


function SidebarSection({ title, count, friends, user}: { title: string; count?: number; friends?: Friend[]; user?: string }) {
  const navigate = useNavigate(); // Get the navigate function

  const handleFriendClick = (friendName: string) => {
    navigate(`/userprofile?user=${friendName || ""}`); // Programmatically navigate to the friend's profile page
  };

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <h4>{title}</h4>
        {title === "Friends" && (
          <button className="btn btn-link text-primary p-0" style={{ fontSize: "14px" }} onClick={() => window.location.href = "#/friendlist?user=me"}>
            Show All
          </button>
        )}
      </div>
      <div className="d-flex flex-wrap gap-2">
        {title === "Friends" && friends && friends.length > 0 ? (
          friends.map((friend, i) => (
            <div key={i} className="text-center">
              {/* When a friend is clicked, navigate to their profile */}
              <img
                src={friend.image && friend.image !== "" ? friend.image : "./static/ProfilePlaceholder.png"}
                alt={friend.name}
                className="rounded-circle"
                style={{ width: "60px", height: "60px", cursor: "pointer" }}
                onClick={() => handleFriendClick(friend.name)} // Use the navigate function here
                onError={(e) => e.currentTarget.src = "./static/ProfilePlaceholder.png"}
              />
              <div style={{ fontSize: "12px", cursor: "pointer" }} onClick={() => handleFriendClick(friend.name)}>
                {friend.name}
              </div>
            </div>
          ))
        ) : (
          [...Array(count || 0)].map((_, i) => (
            <button key={i} className="bg-secondary rounded-circle mb-2" style={{ width: "60px", height: "60px" }} />
          ))
        )}
      </div>
    </div>
  );
}

function MenuItem({ icon, text, handleClick }: { icon: string; text: string; handleClick: () => void }) {
  return (
    <button className="d-flex align-items-center mb-3 w-100 btn" style={{ border: "none", textAlign: "left" }} onClick={handleClick}>
      <img src={icon} className="mr-3" style={{ width: "30px", height: "30px" }} alt={text} />
      <span style={{ fontSize: "25px" }}>{text}</span>
    </button>
  );
}

export default Sidebar;


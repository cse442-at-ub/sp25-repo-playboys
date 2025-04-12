import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCSRFToken } from '../csrfContent';
import { useSidebar } from "../SidebarContext";

interface Friend {
  name: string;
  image: string;
}

function Sidebar() {
  const [searchParams] = useSearchParams();
  const user = searchParams.get("user");
  const navigate = useNavigate();
  const { isOpen, toggleSidebar  } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("Explore");
  const [friends, setFriends] = useState<Friend[]>([]);
  const { csrfToken } = useCSRFToken();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const sections = [
    { title: "Community", count: 8 },
    { title: "My Artist", count: 8 },
  ];

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
          src="/static/logo.jpg"
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
          {sections.map((section, index) => (
            <SidebarSection key={index} title={section.title} count={section.count} />
          ))}
          <hr className="my-4 border-3" style={{ width: "100%", margin: "auto" }} />
        </>
      )}

      {menuItems.map((item, index) => (
        <MenuItem key={index} icon={item.icon} text={item.text} handleClick={item.handleClick} isOpen={isOpen} />
      ))}
    </div>
  );
}

function SidebarSection({ title, count, friends, user }: { title: string; count?: number; friends?: Friend[]; user?: string }) {
  const navigate = useNavigate();
  const handleFriendClick = (friendName: string) => {
    navigate(`/userprofile?user=${friendName || ""}`);
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
        ) : (
          [...Array(count || 0)].map((_, i) => (
            <button key={i} className="bg-secondary rounded-circle mb-2" style={{ width: "50px", height: "50px" }} />
          ))
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

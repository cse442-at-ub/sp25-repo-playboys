
import React, { useState, useEffect } from "react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("Explore"); // Track active tab for mobile

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleFriendsClick = () => console.log("Friends section clicked");
  const handleCommunityClick = () => console.log("Community section clicked");
  const handleMyArtistClick = () => console.log("My Artist section clicked");

  const sections = [
    { title: "Friends", count: 8, handleClick: handleFriendsClick },
    { title: "Community", count: 8, handleClick: handleCommunityClick },
    { title: "My Artist", count: 8, handleClick: handleMyArtistClick },
  ];

  const handleExploreClick = () => {
    console.log("Explore clicked");
    if (isMobile) setActiveTab("Explore");
  };
  const handleMyStatClick = () => {
    console.log("My Stat clicked");
    if (isMobile) setActiveTab("My Stat");
  };
  const handleMyProfileClick = () => {
    window.location.href = "#/userprofile";
    if (isMobile) setActiveTab("My Profile");
  };
  const handleSettingClick = () => {
    window.location.href = "#/settings";
    if (isMobile) setActiveTab("Setting");
  };

  const menuItems = [
    { icon: "./static/ExploreIcon.png", text: "Explore", handleClick: handleExploreClick },
    { icon: "./static/StatisticIcon.png", text: "My Stat", handleClick: handleMyStatClick },
    { icon: "./static/ProfileIcon.png", text: "My Profile", handleClick: handleMyProfileClick },
    { icon: "./static/SettingIcon.png", text: "Setting", handleClick: handleSettingClick },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile Bottom Navigation
  if (isMobile) {
    return (
      <div
        className="fixed-bottom bg-white d-flex justify-content-around p-2"
        style={{ borderTop: "1px solid #ddd", zIndex: 1051 }}
      >
        {menuItems.map((item, index) => (
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

  // Desktop Sidebar
  return (
    <>
      {/* Sidebar Toggle Button (Only on Small Screens) */}
      {isMobile && (
        <button
          className="btn btn-primary d-lg-none"
          style={{ position: "fixed", top: "15px", right: "15px", zIndex: 1050 }}
          onClick={toggleSidebar}
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${isOpen || !isMobile ? "open" : ""}`}
        style={{
          position: "fixed",
          top: "0",
          right: "0",
          width: isOpen || !isMobile ? "250px" : "0",
          maxWidth: "300px",
          height: "100vh",
          overflowY: "auto",
          borderLeft: "2px solid gray",
          backgroundColor: "#ffffff",
          flexDirection: "column",
          opacity: isOpen || !isMobile ? 1 : 0,
          transition: "width 0.3s ease-in-out, opacity 0.3s ease-in-out",
          zIndex: 1049,
        }}
      >
        <div className="bg-secondary text-white p-3 mb-4 text-center">
          <h3>Logo</h3>
        </div>

        {sections.map((section, index) => (
          <SidebarSection key={index} title={section.title} count={section.count} handleClick={section.handleClick} />
        ))}

        <hr className="my-4 border-3" style={{ width: "100%", margin: "auto" }} />

        {menuItems.map((item, index) => (
          <MenuItem key={index} icon={item.icon} text={item.text} handleClick={item.handleClick} />
        ))}

        {isMobile && (
          <button
            className="btn btn-danger mt-3"
            style={{ width: "80%", margin: "auto", textAlign: "center" }}
            onClick={toggleSidebar}
          >
            Close
          </button>
        )}
      </div>
    </>
  );
}

interface SidebarSectionProps {
  title: string;
  count: number;
  handleClick: () => void;
}

function SidebarSection({ title, count, handleClick }: SidebarSectionProps) {
  return (
    <div className="mb-4">
      <h4>{title}</h4>
      <div className="d-flex flex-wrap gap-2">
        {[...Array(count)].map((_, i) => (
          <button
            key={i}
            className="bg-secondary rounded-circle mb-2"
            style={{ width: "60px", height: "60px" }}
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
}

function MenuItem({ icon, text, handleClick }: { icon: string; text: string; handleClick: () => void }) {
  return (
    <button
      className="d-flex align-items-center mb-3 w-100 btn"
      style={{ border: "none", textAlign: "left" }}
      onClick={handleClick}
    >
      <img src={icon} className="mr-3" style={{ width: "30px", height: "30px" }} alt={text} />
      <span style={{ fontSize: "25px" }}>{text}</span>
    </button>
  );
}

export default Sidebar;







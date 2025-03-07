import React, { useState } from "react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Handle functions for each section
  const handleFriendsClick = () => console.log("Friends section clicked");
  const handleCommunityClick = () => console.log("Community section clicked");
  const handleMyArtistClick = () => console.log("My Artist section clicked");

  const sections = [
    { title: "Friends", count: 8, handleClick: handleFriendsClick },
    { title: "Community", count: 8, handleClick: handleCommunityClick },
    { title: "My Artist", count: 8, handleClick: handleMyArtistClick },
  ];

  const handleExploreClick = () => console.log("Explore clicked");
  const handleMyStatClick = () => console.log("My Stat clicked");
  const handleMyProfileClick = () => (window.location.href = "#/userprofile");
  const handleSettingClick = () => (window.location.href = "#/settings");

  const menuItems = [
    { icon: "./static/ExploreIcon.png", text: "Explore", handleClick: handleExploreClick },
    { icon: "./static/StatisticIcon.png", text: "My Stat", handleClick: handleMyStatClick },
    { icon: "./static/ProfileIcon.png", text: "My Profile", handleClick: handleMyProfileClick },
    { icon: "./static/SettingIcon.png", text: "Setting", handleClick: handleSettingClick },
  ];

  return (
    <>
      {/* Sidebar Toggle Button (Only on Small Screens) */}
      <button
        className="btn btn-primary d-xxl-none"
        style={{ position: "fixed", top: "15px", right: "15px", zIndex: 1050 }}
        onClick={toggleSidebar}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar ${isOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          width: isOpen ? "250px" : "0",
          maxWidth: "300px",
          top: "0",
          right: "0",
          height: "100vh",
          overflowY: "auto",
          borderLeft: isOpen ? "2px solid gray" : "none",
          backgroundColor: "#ffffff",
          flexDirection: "column",
          opacity: isOpen ? 1 : 0,
          transition: "width 0.3s ease-in-out, opacity 0.3s ease-in-out",
          display: isOpen ? "flex" : "none",
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

        {/* Close button for mobile view */}
        <button
          className="btn btn-danger mt-3"
          style={{ width: "80%", margin: "auto", textAlign: "center" }}
          onClick={toggleSidebar}
        >
          Close
        </button>
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
    <button className="d-flex align-items-center mb-3 w-100 btn" style={{ border: "none", textAlign: "left" }} onClick={handleClick}>
      <img src={icon} className="mr-3" style={{ width: "30px", height: "30px" }} alt={text} />
      <span style={{ fontSize: "25px" }}>{text}</span>
    </button>
  );
}

export default Sidebar;

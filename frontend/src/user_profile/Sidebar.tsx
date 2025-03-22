import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Colors, FontSizes, Spacing } from '../style_guide';

function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("Explore");

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sections = [
    { title: "Friends", count: 8, handleClick: () => console.log("Friends clicked") },
    { title: "Community", count: 8, handleClick: () => console.log("Community clicked") },
    { title: "My Artist", count: 8, handleClick: () => console.log("My Artist clicked") },
  ];

  const menuItems = [
    { icon: "./static/ExploreIcon.png", text: "Explore", handleClick: () => handleClick("/explore", "Explore") },
    { icon: "./static/StatisticIcon.png", text: "My Stat", handleClick: () => handleClick("#", "My Stat") },
    { icon: "./static/ProfileIcon.png", text: "My Profile", handleClick: () => handleClick("#/userprofile", "My Profile") },
    { icon: "./static/SettingIcon.png", text: "Setting", handleClick: () => handleClick("#/settings", "Setting") },
  ];

  const handleClick = (link: string, tab: string) => {
    if (link.startsWith("#/")) window.location.href = link;
    else navigate(link);
    if (isMobile) setActiveTab(tab);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="fixed-bottom bg-white d-flex justify-content-around p-2" style={{ borderTop: `1px solid ${Colors.secondary}`, zIndex: 1051 }}>
        {menuItems.map((item, index) => (
          <button key={index} className={`btn ${activeTab === item.text ? "text-primary" : "text-secondary"}`} onClick={item.handleClick}>
            <img src={item.icon} style={{ width: "30px", height: "30px" }} alt={item.text} />
            <span style={{ fontSize: FontSizes.xs }}>{item.text}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <>
      {isMobile && (
        <button className="btn btn-primary d-lg-none" style={{ position: "fixed", top: "15px", right: "15px", zIndex: 1050 }} onClick={toggleSidebar}>☰</button>
      )}
      <div className={`sidebar ${isOpen || !isMobile ? "open" : ""}`} style={{ position: "fixed", top: "0", right: "0", width: isOpen || !isMobile ? "250px" : "0", maxWidth: "300px", height: "100vh", overflowY: "auto", borderLeft: `2px solid ${Colors.secondary}`, backgroundColor: Colors.white, opacity: isOpen || !isMobile ? 1 : 0, transition: "width 0.3s ease-in-out, opacity 0.3s ease-in-out", zIndex: 1049 }}>
        <div style={{ backgroundColor: Colors.secondary, color: Colors.white, padding: Spacing.md, textAlign: "center" }}>
          <h3>Logo</h3>
        </div>
        {sections.map((section, index) => (
          <SidebarSection key={index} title={section.title} count={section.count} handleClick={section.handleClick} />
        ))}
        <hr className="my-4 border-3" />
        {menuItems.map((item, index) => (
          <MenuItem key={index} icon={item.icon} text={item.text} handleClick={item.handleClick} />
        ))}
        {isMobile && (
          <button className="btn btn-danger mt-3" style={{ width: "80%", margin: "auto" }} onClick={toggleSidebar}>Close</button>
        )}
      </div>
    </>
  );
}

function SidebarSection({ title, count, handleClick }: { title: string; count: number; handleClick: () => void }) {
  return (
    <div className="mb-4">
      <h4>{title}</h4>
      <div className="d-flex flex-wrap gap-2">
        {[...Array(count)].map((_, i) => (
          <button key={i} style={{ backgroundColor: Colors.secondary, width: "60px", height: "60px", borderRadius: "50%" }} onClick={handleClick} />
        ))}
      </div>
    </div>
  );
}

function MenuItem({ icon, text, handleClick }: { icon: string; text: string; handleClick: () => void }) {
  return (
    <button className="d-flex align-items-center mb-3 w-100 btn" style={{ border: "none" }} onClick={handleClick}>
      <img src={icon} className="mr-3" style={{ width: "30px", height: "30px" }} alt={text} />
      <span style={{ fontSize: FontSizes.lg }}>{text}</span>
    </button>
  );
}

export default Sidebar;

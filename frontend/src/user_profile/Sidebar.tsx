import React from 'react';

function Sidebar() {

// Handle functions for each section
  const handleFriendsClick = () => {
    console.log('Friends section clicked');
    //'Implementation for Friends
  };

  const handleCommunityClick = () => {
    console.log('Community section clicked');
    //'Implementation for Community
  };

  const handleMyArtistClick = () => {
    console.log('My Artist section clicked');
    //'Implementation for My Artist
  };
  const sections = [
    { title: 'Friends', count: 8, handleClick: handleFriendsClick },
    { title: 'Community', count: 8, handleClick: handleCommunityClick },
    { title: 'My Artist', count: 8, handleClick: handleMyArtistClick }
  ];



    // Menu item handler functions (as before)
    const handleExploreClick = () => {
        console.log('Explore clicked');
        };

    const handleMyStatClick = () => {
        console.log('My Stat clicked');
    };

    const handleMyProfileClick = () => {
        window.location.href = "#/userprofile";
    };

    const handleSettingClick = () => {
        window.location.href = "#/settings";
    };

  const menuItems = [
    { icon: './static/ExploreIcon.png', text: 'Explore', handleClick: handleExploreClick },
    { icon: './static/StatisticIcon.png', text: 'My Stat', handleClick: handleMyStatClick },
    { icon: './static/ProfileIcon.png', text: 'My Profile', handleClick: handleMyProfileClick },
    { icon: './static/SettingIcon.png', text: 'Setting', handleClick: handleSettingClick }
  ];

  return (
    <div 
      className="sidebar d-none d-xxl-block"
      style={{
        position: "fixed",
        width: "300px",
        maxWidth: "300px",
        top: "0",
        right: "0",
        height: "100vh",
        overflowY: "auto",
        borderLeft: "2px solid gray",
        display: "flex",
        backgroundColor: "#ffffff",
        flexDirection: "column",
        opacity: 1
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
    </div>
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
            style={{ width: '60px', height: '60px' }} 
            onClick={handleClick} // Call the handleClick function on button click
          />
        ))}
      </div>
    </div>
  );
}

function MenuItem({ icon, text, handleClick }: { icon: string; text: string; handleClick: () => void }) {
  return (
    <button 
      className="d-flex align-items-center mb-3 w-70 btn" 
      style={{ border: "none", textAlign: "left" }} 
      onClick={handleClick}
    >
      <img src={icon} className="mr-3" style={{ width: "30px", height: "30px" }} alt={text} />
      <span style={{ fontSize: "25px" }}>{text}</span>
    </button>
  );
}

export default Sidebar;
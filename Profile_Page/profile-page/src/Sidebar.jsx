import React from 'react';

function Sidebar() {
  const sections = [
    { title: 'Friends', count: 8 },
    { title: 'Community', count: 8 },
    { title: 'My Artist', count: 8 }
  ];

  const menuItems = [
    { icon: './static/ExploreIcon.png', text: 'Explore' },
    { icon: './static/StatisticIcon.png', text: 'My Stat' },
    { icon: './static/ProfileIcon.png', text: 'My Profile' },
    { icon: './static/SettingIcon.png', text: 'Setting' }
  ];

  return (
    <div className="mt-4"
    style={{
        position: "fixed",
        width: "450px",
        maxwidth: "450px", // Fixed width
        top: "0",
        right: "0",
        height: "100vh",
        overflowY: "auto",
        borderLeft: "2px solid gray", // Black vertical line
        display: "flex",
        flexDirection: "column", // Ensures items stay in place
    }}
    >
    <div className="bg-secondary text-white p-3 mb-4 text-center">
        <h3>Logo</h3>
    </div>
    {sections.map((section, index) => (
        <SidebarSection key={index} title={section.title} count={section.count} />
    ))}
    <hr className="my-4 border-light" />
    {menuItems.map((item, index) => (
        <MenuItem key={index} icon={item.icon} text={item.text} />
    ))}
    </div>
    );
}

function SidebarSection({ title, count }) {
  return (
    <div className="mb-4">
      <h4>{title}</h4>
      <div className="d-flex flex-wrap gap-2">
        {[...Array(count)].map((_, i) => (
          <button key={i} className="bg-secondary rounded-circle mr-2 mb-2" style={{width: '100px', height: '100px'}} />
        ))}
      </div>
    </div>
  );
}

function MenuItem({ icon, text }) {
    return (
      <button className="d-flex align-items-center mb-3 w-90 btn btn-light" style={{ border: "none", textAlign: "left" }}>
        <img src={icon} className="mr-3" style={{ width: "40px", height: "40px" }} alt={text} />
        <span style={{ fontSize: "30px", fontWeight: "bold" }}>{text}</span>
      </button>
    );
  }
  

export default Sidebar;
// components/MainContent.tsx
import React from "react";
import { useSidebar } from "./SidebarContext";

const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen } = useSidebar();

  return (
    <div
      style={{
        marginRight: isOpen ? "250px" : "60px", // adjust to match sidebar width
        transition: "margin-right 0.3s ease-in-out",
        padding: "20px",
      }}
    >
      {children}
    </div>
  );
};

export default MainContent;

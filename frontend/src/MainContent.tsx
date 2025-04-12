import React, { useEffect, useState } from "react";
import { useSidebar } from "./SidebarContext";

const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        marginRight: isMobile ? "0" : isOpen ? "250px" : "60px",
        transition: "margin-right 0.3s ease-in-out",
        padding: "20px",
      }}
    >
      {children}
    </div>
  );
};

export default MainContent;

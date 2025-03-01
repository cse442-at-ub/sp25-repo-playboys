import React, { ReactNode } from "react";
import "./Box.module.css"; // Ensure this file exists

// Define props for the Box component
interface BoxProps {
  children: ReactNode; // This allows the component to accept nested elements
}

const Box: React.FC<BoxProps> = ({ children }) => {
  return <div className="box">{children}</div>;
};

export default Box;

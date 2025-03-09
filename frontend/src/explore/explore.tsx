import React from "react";
import Trending from "./trending";
import Recommended from "./recommended";
import NewReleases from "./newReleases";
import "./explore.css";


const Explore: React.FC = () => {
  return (
    <div className="explore-page">
      <h1>Explore</h1>
      <p>Welcome to the Explore page. Discover new content and features here!</p>
      
      
      <Trending />
      <Recommended />
      <NewReleases />
    </div>
  );
};

export default Explore;

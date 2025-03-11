import React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../user_profile/Sidebar";
import "./genre.css";

const GenrePage: React.FC = () => {
  const { genre } = useParams<{ genre: string }>();

  return (
    <div className="genre-page">
      <Sidebar />
      <div className="genre-content">
        <h1 className="genre-title">
          {genre ? genre.charAt(0).toUpperCase() + genre.slice(1) : "Genre"}
        </h1>
        <p className="genre-description">
          Explore the best in {genre} music—discover top tracks, albums, and artists.
        </p>
        {/* Additional content can be added here */}
      </div>
    </div>
  );
};

export default GenrePage;

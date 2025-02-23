import React from 'react';
import { useNavigate } from 'react-router-dom';

function Playlists() {
    const artists = [
        { name: 'Drake', image: './static/Drakepfp.png' },
        { name: 'Ado', image: './static/Adopfp.png' },
        { name: 'Beatles', image: './static/TheBeatlespfp.png' }
      ];
    
      const navigate = useNavigate();
      const handleShowAllClick = () => {
        console.log("Show all clicked");
        navigate('/playlist-view')
      };
    
      return (
        <div className="mt-5">
         <div className="d-flex justify-content-between align-items-center">
          <h2 className="display-4 font-weight-bold">♬ Playlists</h2>
          <button className="btn btn-link btn-lg text-dark h4" onClick={handleShowAllClick}>
            Show all
          </button>
         </div>
          <div className="row mt-4">
            {artists.map((artist, index) => (
              <div key={index} className="col-md-4 mb-4">
                <ArtistItem artist={artist} />
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    function ArtistItem({ artist, onClick }) {
      return (
        <button
          className="text-center border-0 bg-transparent"
          onClick={() => onClick(artist)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={artist.image}
            alt={`${artist.name} profile picture`}
            className="img-fluid rounded-circle mb-3"
            style={{ width: "400px", height: "400px" }} //size
          />
          <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>{artist.name}</h3>
        </button>
      );
}

export default Playlists;
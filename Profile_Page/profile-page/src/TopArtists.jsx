import React from 'react';

function TopArtists() {
  const artists = [
    { name: 'Drake', image: './static/Drakepfp.png' },
    { name: 'Ado', image: './static/Adopfp.png' },
    { name: 'Beatles', image: './static/TheBeatlespfp.png' }
  ];

  return (
    <div className="mt-5">
      <h2 className="display-4 font-weight-bold">Top Artists</h2>
      <div className="row mt-4">
        {artists.map((artist, index) => (
          <div key={index} className="col-md-4 mb-4">
            <ArtistItem artist={artist} />
          </div>
        ))}
      </div>
      <div className="text-right">
        <button className="btn btn-link text-dark h4">Show all</button>
      </div>
    </div>
  );
}

function ArtistItem({ artist }) {
  return (
    <div className="text-center">
      <img
        src={artist.image}
        alt={`${artist.name} profile picture`}
        className="img-fluid rounded-circle mb-3"
      />
      <h3>{artist.name}</h3>
    </div>
  );
}

export default TopArtists;
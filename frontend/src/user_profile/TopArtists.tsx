import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading, PrimaryButton, Colors, FontSizes, Spacing } from '../style_guide'; // Import style guide

interface Artist {
  name: string;
  image: string;
}

function TopArtists() {
  const artists: Artist[] = [
    { name: 'Drake', image: './static/Drakepfp.png' },
    { name: 'Ado', image: './static/Adopfp.png' },
    { name: 'Beatles', image: './static/TheBeatlespfp.png' }
  ];
  const navigate = useNavigate();

  const handleShowAllClick = () => {
    navigate('/top-artists');
  };

  const handleArtistClick = (artist: Artist) => {
    console.log(`Artist clicked: ${artist.name}`);
  };

  return (
    <div style={{ marginTop: Spacing.md, padding: `0 ${Spacing.md}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Heading level={2}>Top Artists</Heading>
        <button
          onClick={handleShowAllClick}
          style={{
            background: 'none',
            border: 'none',
            color: Colors.dark,
            fontSize: FontSizes.base,
            cursor: 'pointer'
          }}
        >
          Show all
        </button>
      </div>
      <div className="row mt-3">
        {artists.map((artist, index) => (
          <div key={index} className="col-6 col-sm-4 mb-3 d-flex justify-content-center">
            <ArtistItem artist={artist} onClick={handleArtistClick} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ArtistItem({ artist, onClick }: { artist: Artist; onClick: (artist: Artist) => void }) {
  return (
    <button
      onClick={() => onClick(artist)}
      style={{
        background: 'transparent',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        width: '100%'
      }}
    >
      <img
        src={artist.image}
        alt={`${artist.name} profile`}
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          marginBottom: Spacing.sm,
          objectFit: 'cover'
        }}
      />
      <span style={{ fontSize: FontSizes.sm, fontWeight: 600, maxWidth: '90px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        {artist.name}
      </span>
    </button>
  );
}

export default TopArtists;

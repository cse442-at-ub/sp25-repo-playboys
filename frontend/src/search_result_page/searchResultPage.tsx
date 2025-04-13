import React from 'react';
import Sidebar from '../user_profile/Sidebar';
import SearchBar from './searchBar';
import SongResults from './songResults'
import ArtistResults from './artistResults';
import EventResults from './eventResults';
import CommunityResults from './communityResults';
import './SearchResultPage.css'; // Import the CSS file for styling
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCSRFToken } from '../csrfContent';
import MainContent from "../MainContent"; // Adjust path if needed



interface Song {
    album: string;
    artists_names: string[];
    duration: string;
    image_url: string;
    name: string;
    popularity: number;
    spotify_url: string;
    type: string;
}

interface Artist {
    followers :number,
    genres: string[],
    image_url: string,
    name: string,
    popularity: number, 
}

interface Event {
    date: string;
    time: string;
    location: string;
    name: string;
    artist: string;
    image: string;
}




const SearchResultPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const search_query = searchParams.get('q');
    const handleBackButton = () => {
        navigate("/explore");
        // Your navigation code here
    };
    const {csrfToken} = useCSRFToken();
    const [songs, setSongs] = React.useState<Song[]>([]);
    const [artists, setArtists] = React.useState<Artist[]>([]);
    const [events, setEvents] = React.useState<Event[]>([]);
    React.useEffect(() => {
        if(search_query) {
            handleSearch(search_query);
        }
    }, [search_query]);
    
    const handleSearch = async (query: string) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/search_artist.php?q=${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'CSRF-Token': csrfToken,
            },
            credentials: 'include',
        });
        const result = await response.json();
        setSongs(result["songs"].map((song: any) => ({
            album: song.album,
            artists_names: song.artist_names,
            duration: song.duration,
            image_url: song.image_url,
            name: song.name,
            popularity: song.popularity,
            spotify_url: song.spotify_url,
            type: song.type
        })));
        setArtists(result["artists"].map((artist: any) => ({
            followers :artist.followers,
            genres: artist.genres,
            image_url: artist.image_url,
            name: artist.name,
            popularity: artist.popularity, 
        })));
        setEvents(result["events"].map((event: any) =>({
            date : event.date,
            time: event.time,
            location: event.location,
            name: event.name,
            artist: event.artist,
            image: event.image,
        })));
    }


    return (
        <MainContent>
        <div className="search-result-container">
            <div className="main-content">
                <div className="search-bar-row">
                    <button className="back-button" onClick={handleBackButton} aria-label="Go back">
                        ←
                    </button>
                    <div className="search-bar-container">
                        <SearchBar onFormSubmit={handleSearch}/>
                    </div>
                </div>
                <div className="song-results">
                    {/* Search Results Content Goes Here */}
                    <SongResults data={songs} />
                </div>
                <div className="artist-results">
                    <ArtistResults data={artists} />
                </div>
                <div className="community-results">
                    <CommunityResults data={artists}/>
                </div>
                <div className="event-results">
                    <EventResults data={events} />
                </div>
            </div>
            
            <Sidebar/>
        </div>
        </MainContent>
    );
};

export default SearchResultPage;
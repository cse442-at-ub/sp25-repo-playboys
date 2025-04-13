import React from 'react';
import './searchResultPage'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';


const SearchBar = ({ onFormSubmit }: {onFormSubmit : (query:string) => void}) => {

    const [query, setQuery] = React.useState("");
    const navigate = useNavigate();
    const search = (e:React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search_results?q=${encodeURIComponent(query.trim())}`);
        }
    }
    

    return (
        <div className="search-bar">
            <form onSubmit={search}>
                <img src="./static/SearchIcon.png" alt="Search Icon" className="search-icon" />
                <input type="text" placeholder="Search..." className="search-input" value={query} onChange={(e) => setQuery(e.target.value)}/>
            </form>
            <button type="submit" style={{display: "none"}}></button>
        </div>
    );
};

export default SearchBar;

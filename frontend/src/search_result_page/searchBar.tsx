import React from 'react';
import './searchResultPage'; // Import the CSS file for styling


const SearchBar = ({ onFormSubmit }: {onFormSubmit : (query:string) => void}) => {

    const [query, setQuery] = React.useState("");

    const search = (e:React.FormEvent) => {
        e.preventDefault();
        onFormSubmit(query);
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

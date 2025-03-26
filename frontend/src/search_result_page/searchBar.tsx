import React from 'react';
import './searchResultPage'; // Import the CSS file for styling

const SearchBar = () => {
    return (
        <div className="search-bar">
            <img src="./static/SearchIcon.png" alt="Search Icon" className="search-icon" />
            <input type="text" placeholder="Search..." className="search-input" />
        </div>
    );
};

export default SearchBar;

import React, { useState, useRef } from 'react';
import './searchResultPage';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onFormSubmit }: { onFormSubmit: (query: string) => void }) => {
    const [query, setQuery] = useState("");
    const [placeholder, setPlaceholder] = useState("Search for a genre, artist, songs, events... 🔍");
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    const search = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search_results?q=${encodeURIComponent(query.trim())}`);
            // Clear the input value after navigation
            setQuery("");
            // Set the placeholder back
            setPlaceholder("Search for a genre, artist, songs, events... 🔍");
            // Remove focus from the input
            if (inputRef.current) {
                inputRef.current.blur();
            }
            if (onFormSubmit) {
                onFormSubmit(query.trim());
            }
        }
    };

    return (
        <div className="search-bar">
            <form onSubmit={search}>
                <input
                    type="text"
                    placeholder={placeholder}
                    className="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    ref={inputRef}
                />
            </form>
            <button type="submit" style={{ display: "none" }}></button>
        </div>
    );
};

export default SearchBar;
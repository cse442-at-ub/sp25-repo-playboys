import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './searchUserBar.css';
import { useCSRFToken } from "../csrfContent";

interface UserSearchBarProps {
  onSearch: (query: string) => void; // Function to handle the search logic
}

interface Users {
  name: string;
  image: string;
  login_user: string;
}

const UserSearchBar = ({ onSearch }: UserSearchBarProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Users[]>([]); // State for search results
  const { csrfToken } = useCSRFToken();
  const dropdownRef = useRef<HTMLDivElement>(null); // Reference to the dropdown element

  const [isSearching, setIsSearching] = useState(false); // State for loading
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // State for controlling dropdown visibility

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setIsDropdownVisible(event.target.value.length >= 3); // Show dropdown only when 3+ chars are typed
  };

  useEffect(() => {
    if (searchQuery.length >= 3) {
      const debounceTimeout = setTimeout(() => {
        fetchSearchResults(searchQuery);
      }, 500); // Delay of 500ms before triggering search

      return () => clearTimeout(debounceTimeout); // Clear the timeout if the searchQuery changes before delay
    }
  }, [searchQuery]); // Re-run whenever searchQuery changes

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false); // Hide the dropdown
        setSearchQuery(''); // Clear the search bar
      }
    };

    // Add the event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Attach the listener only once

  const fetchSearchResults = async (query: string) => {
    setIsSearching(true); // Set loading state to true when starting search
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}backend/userSearch.php?searchQuery=${query}`, {
        method: "GET",
        credentials: "include",
        headers: { 'CSRF-Token': csrfToken },
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
    setIsSearching(false); // Set loading state to false after search is completed
  };

  const handleSearch = () => {
    onSearch(searchQuery); // Trigger the search logic passed via props
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleSearch(); // Trigger search on pressing enter or space
    }
  };

  const goToProfile = (friendName: string) => {
    // Redirect to the friend's profile page
    navigate(`/userprofile?user=${friendName || ""}`); 
  };

  return (
    <div className="user-search-bar">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search users..."
        className="user-search-bar-input"
      />
      <button onClick={handleSearch} className="user-search-bar-button">
        Search
      </button>

      {/* Conditionally render the dropdown with loading state only */}
      {isDropdownVisible && (
        <div
          className="user-search-bar-results-dropdown"
          ref={dropdownRef} // Attach the ref to the dropdown element
        >
          {isSearching ? (
            <div className="user-search-bar-loading">Loading...</div> // Show loading inside the dropdown
          ) : searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div key={index} className="user-search-bar-result-item">
                <img 
                  src={result.image || "./static/ProfilePlaceholder.png"} 
                  alt={result.name} 
                  onError={(e) => e.currentTarget.src = "./static/ProfilePlaceholder.png"} 
                  onClick={() => goToProfile(result.name)}
                  style={{ cursor: "pointer" }} 
                  className="user-search-bar-result-image" 
                />
                {result.login_user == result.name ? (
                    <span 
                    onClick={() => goToProfile(result.name)} 
                    style={{ cursor: "pointer" }} 
                    className="user-search-bar-result-name"
                  >
                    {result.name + " (you)"}
                  </span>
                ) : (
                  <span 
                  onClick={() => goToProfile(result.name)} 
                  style={{ cursor: "pointer" }} 
                  className="user-search-bar-result-name"
                >
                  {result.name}
                </span>
                )}

              </div>
            ))
          ) : (
            <div className="user-search-bar-no-results">No users found</div> // Show "No users found" if no results
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearchBar;





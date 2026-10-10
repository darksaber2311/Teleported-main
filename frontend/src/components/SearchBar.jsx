import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchBar = ({ onSelectPlace }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    console.log("Typing:", value);

    if (value.length > 1) {
      const res = await axios.get(
        `http://localhost:5000/api/places/search?q=${value}`
      );
      setSuggestions(res.data);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (place) => {
    setQuery(place.name);
    setSuggestions([]);
    onSelectPlace(place);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      onSelectPlace(suggestions[0]);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Where's your next vacation...?"
          value={query}
          onChange={handleChange}
        />
      </form>

      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((place) => (
            <div
              key={place._id}
              onClick={() => handleSelect(place)}
              className="suggestion-item"
            >
              {place.name}, {place.state}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
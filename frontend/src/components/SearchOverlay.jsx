import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const categoryEmoji = {
  mountain:'🏔️', beach:'🏖️', hillstation:'⛰️', monument:'🏛️',
  island:'🏝️', wildlife:'🦁', food:'🍛', amusement:'🎡', city:'🌆',
};

export default function SearchOverlay({ onClose, onSelectPlace }) {
  const navigate = useNavigate();
  const [query, setQuery]           = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [popular, setPopular]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    axios.get(`${API}/places/popular`).then(r => setPopular(r.data)).catch(() => {});
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/places/search?q=${query}`);
        setSuggestions(data);
      } catch { setSuggestions([]); }
      finally { setLoading(false); }
    }, 280);
    return () => clearTimeout(t);
  }, [query]);

  const handleSelect = (place) => {
    if (onSelectPlace) {
      onSelectPlace(place);
      onClose();
    } else {
      onClose();
      navigate(`/place/${place._id}`);
    }
  };

  const handleStateClick = (state) => {
    onClose();
    navigate(`/state/${encodeURIComponent(state)}`);
  };

  return (
    <motion.div
      className="search-overlay-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -30, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Search panel */}
        <div className="search-overlay-panel">
          <div className="search-input-row">
            <div className="search-input-container">
              <span className="search-icon-wrap"><FiSearch /></span>
              <input
                ref={inputRef}
                className="search-main-input"
                placeholder="Search places, states in India…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <button className="search-close-btn" onClick={onClose}><FiX /></button>
          </div>
        </div>

        {/* Content */}
        <div className="search-content">
          <AnimatePresence mode="wait">
            {query.trim() ? (
              <motion.div key="suggestions" className="search-suggestions"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {loading && <p className="muted-text">Searching…</p>}
                {!loading && suggestions.length === 0 && (
                  <p className="muted-text">No results for "{query}"</p>
                )}
                {suggestions.map(place => (
                  <div key={place._id} className="suggestion-item" onClick={() => handleSelect(place)}>
                    {place.imageUrl
                      ? <img src={place.imageUrl} alt={place.name} className="suggestion-img" onError={e => { e.target.style.display='none'; }} />
                      : <div className="suggestion-img-fallback">{categoryEmoji[place.category] || '📍'}</div>
                    }
                    <div className="suggestion-info">
                      <div className="suggestion-name">{place.name}</div>
                      <div
                        className="suggestion-state"
                        onClick={(e) => { e.stopPropagation(); handleStateClick(place.state); }}
                        style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
                      >
                        {place.state}
                      </div>
                    </div>
                    <FiArrowRight className="suggestion-arrow" />
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="popular"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="search-section-title">Trending Places</div>
                <div className="popular-grid">
                  {popular.map(place => (
                    <motion.div key={place._id} className="popular-card"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleSelect(place)}>
                      {place.imageUrl
                        ? <img src={place.imageUrl} alt={place.name} className="popular-card-img" onError={e => e.target.style.display='none'} />
                        : <div className="popular-card-img-fallback">{categoryEmoji[place.category]}</div>
                      }
                      <div className="popular-card-body">
                        <div className="popular-card-name">{place.name}</div>
                        <div className="popular-card-state">{place.state}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

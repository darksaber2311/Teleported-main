import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiCompass, FiHeart, FiCheckSquare, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { usePlaces } from '../context/PlacesContext';
import { AnimatePresence } from 'framer-motion';
import SearchOverlay from './SearchOverlay';

export default function Navbar({ onSelectPlace }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { wishlist } = usePlaces();
  const [searchOpen, setSearchOpen] = useState(false);

  // Expose profile opener via window (simple approach for Home to pass down)
  const openProfile = () => {
    const event = new CustomEvent('openProfile');
    window.dispatchEvent(event);
  };

  const isActive = (path) => location.pathname === path;

  const initial = user?.username?.[0]?.toUpperCase() || '?';

  return (
    <>
      <nav className="teleported-navbar">
        {/* Logo */}
        <div className="nav-logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
          {/*<span className="nav-logo-icon">✈️</span> */}
          <span className="nav-logo-text">Teleported</span>
        </div>

        {/* Search */}
        <button className="nav-search-btn" onClick={() => setSearchOpen(true)}>
          <FiSearch size={14} />
          <span className="search-placeholder">Search places in India…</span>
        </button>

        {/* Nav actions */}
        <div className="nav-actions">
          <button className={`nav-action-btn ${isActive('/explore') ? 'active' : ''}`}
            onClick={() => navigate('/explore')}>
            <FiCompass className="nav-icon" />
            Explore
          </button>
          <button className={`nav-action-btn ${isActive('/wishlist') ? 'active' : ''}`}
            onClick={() => navigate('/wishlist')}>
            <FiHeart className="nav-icon" />
            Wishlist
            {wishlist.length > 0 && (
              <span style={{ fontSize: '0.6rem', background: 'var(--accent)', color: '#0a0a0b', borderRadius: '999px', padding: '1px 6px', marginLeft: 3, fontFamily: 'DM Sans, sans-serif', fontWeight: 700 }}>
                {wishlist.length}
              </span>
            )}
          </button>
          <button className={`nav-action-btn ${isActive('/visited') ? 'active' : ''}`}
            onClick={() => navigate('/visited')}>
            <FiCheckSquare className="nav-icon" />
            Visited
          </button>
          <button className={`nav-action-btn ${isActive('/visiting') ? 'active' : ''}`}
            onClick={() => navigate('/visiting')}>
            <FiMapPin className="nav-icon" />
            Visiting
          </button>

          {/* Avatar */}
          <div onClick={openProfile} style={{ marginLeft: 6, cursor: 'pointer' }}>
            {user?.profilePic
              ? <img src={user.profilePic} alt="avatar" className="nav-avatar" />
              : <div className="nav-avatar-placeholder">{initial}</div>
            }
          </div>
        </div>
      </nav>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <SearchOverlay
            onClose={() => setSearchOpen(false)}
            onSelectPlace={(place) => { if (onSelectPlace) onSelectPlace(place); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
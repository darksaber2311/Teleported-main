import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import ProfileSidebar from '../components/ProfileSidebar';
import { usePlaces } from '../context/PlacesContext';

const API = 'http://localhost:5000/api';

const FILTERS = [
  { key: 'all', label: 'All', emoji: '🌏' },
  { key: 'mountain', label: 'Mountains', emoji: '🏔️' },
  { key: 'beach', label: 'Beaches', emoji: '🏖️' },
  { key: 'hillstation', label: 'Hill Stations', emoji: '⛰️' },
  { key: 'monument', label: 'Monuments', emoji: '🏛️' },
  { key: 'island', label: 'Islands', emoji: '🏝️' },
  { key: 'wildlife', label: 'Wildlife', emoji: '🦁' },
  { key: 'food', label: 'Food', emoji: '🍛' },
  { key: 'amusement', label: 'Amusement', emoji: '🎡' },
  { key: 'city', label: 'Cities', emoji: '🌆' },
];

export default function Explore() {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = usePlaces();

  const [all, setAll] = useState([]);
  const [filter, setFilter] = useState('all');
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setProfileOpen(true);
    window.addEventListener('openProfile', handler);
    return () => window.removeEventListener('openProfile', handler);
  }, []);

  useEffect(() => {
    axios.get(`${API}/places/all`).then(r => setAll(r.data)).catch(() => { });
  }, []);

  const displayed = filter === 'all' ? all : all.filter(p => p.category === filter);

  const categoryEmoji = { mountain: '🏔️', beach: '🏖️', hillstation: '⛰️', monument: '🏛️', island: '🏝️', wildlife: '🦁', food: '🍛', amusement: '🎡', city: '🌆' };

  return (
    <div className="explore-page">
      <Navbar />

      <div className="explore-header">
        <div className="explore-title">Explore <span>India</span></div>
        <div className="explore-filters">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`filter-pill ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="explore-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="explore-grid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {displayed.map((place, i) => (
              <motion.div
                key={place._id}
                className="explore-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.035, duration: 0.28 }}
                onClick={() => navigate(`/place/${place._id}`)}
              >
                <div className="explore-card-img-wrap">
                  <span className={`badge badge-${place.category}`}>
                    {categoryEmoji[place.category]} {place.category}
                  </span>
                  {place.imageUrl
                    ? <img src={place.imageUrl} alt={place.name} className="explore-card-img"
                      onError={e => e.target.style.display = 'none'} />
                    : <div className="explore-card-img-fallback">{categoryEmoji[place.category]}</div>
                  }
                </div>
                <div className="explore-card-body">
                  <div className="explore-card-name">{place.name}</div>
                  <div className="explore-card-state">{place.state}</div>
                  <div className="explore-card-footer">
                    {place.bestSeason && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>🗓 {place.bestSeason}</span>
                    )}
                    <button
                      className={`explore-wishlist-btn ${isWishlisted(place._id) ? 'active' : ''}`}
                      onClick={async (e) => {
                        e.stopPropagation();
                        await toggleWishlist(place._id);
                        toast(isWishlisted(place._id) ? '💔 Removed' : '❤️ Wishlisted!');
                      }}
                    >
                      <FiHeart size={15} fill={isWishlisted(place._id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {displayed.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                No places found in this category.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {profileOpen && <ProfileSidebar onClose={() => setProfileOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

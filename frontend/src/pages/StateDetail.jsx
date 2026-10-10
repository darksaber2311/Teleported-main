import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProfileSidebar from '../components/ProfileSidebar';
import { usePlaces } from '../context/PlacesContext';
import { toast } from 'react-toastify';

const API = 'http://localhost:5000/api';

const categoryEmoji = {
  mountain: '🏔️', beach: '🏖️', hillstation: '⛰️', monument: '🏛️',
  island: '🏝️', wildlife: '🦁', food: '🍛', amusement: '🎡', city: '🌆',
};

const stateImages = {
  'Himachal Pradesh': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900',
  'Uttarakhand': 'https://images.unsplash.com/photo-1626015366386-7b3acf034571?w=900',
  'Goa': 'https://images.unsplash.com/photo-1587135991058-8816b028691f?w=900',
  'Rajasthan': 'https://images.unsplash.com/photo-1477587458883-47145ed31069?w=900',
  'Kerala': 'https://images.unsplash.com/photo-1602343168117-bb8a12d7c180?w=900',
  'Karnataka': 'https://images.unsplash.com/photo-1600697229585-95c2dc6c1c55?w=900',
  'Tamil Nadu': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=900',
  'West Bengal': 'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=900',
  'Andaman & Nicobar Islands': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900',
  'Uttar Pradesh': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900',
};

export default function StateDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const stateName = decodeURIComponent(name);
  const { isWishlisted, toggleWishlist } = usePlaces();

  const [places, setPlaces] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const heroImg = stateImages[stateName] || `https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=900`;

  useEffect(() => {
    const handler = () => setProfileOpen(true);
    window.addEventListener('openProfile', handler);
    return () => window.removeEventListener('openProfile', handler);
  }, []);

  useEffect(() => {
    axios.get(`${API}/places/state/${encodeURIComponent(stateName)}`).then(r => setPlaces(r.data)).catch(() => { });
  }, [stateName]);

  return (
    <motion.div className="state-page"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

      <Navbar />

      <div className="state-hero" style={{ marginTop: 'var(--navbar-h)' }}>
        <img src={heroImg} alt={stateName} className="state-hero-img" onError={e => e.target.style.display = 'none'} />
        <div className="state-hero-overlay" />
        <button className="detail-back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft size={13} /> Back
        </button>
        <div className="state-hero-content">
          <div className="state-name">{stateName}</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: 4 }}>
            {places.length} popular place{places.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="state-body">
        <div>
          <div className="detail-section-title">Popular Places in {stateName}</div>
          <div className="state-places-grid">
            {places.map(place => (
              <motion.div key={place._id}
                className="place-card-h"
                whileHover={{ scale: 1.01 }}
                onClick={() => navigate(`/place/${place._id}`)}>
                {place.imageUrl
                  ? <img src={place.imageUrl} alt={place.name} className="place-card-h-img"
                    onError={e => e.target.style.display = 'none'} />
                  : <div className="place-card-h-img-fallback">{categoryEmoji[place.category]}</div>
                }
                <div className="place-card-h-body">
                  <div className="place-card-h-name">{place.name}</div>
                  <div className="place-card-h-state">{place.state}</div>
                  {place.bestSeason && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--green)', marginTop: 4 }}>
                      🗓 {place.bestSeason}
                    </div>
                  )}
                </div>
                <div className="place-card-h-actions">
                  <button
                    style={{
                      background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer',
                      color: isWishlisted(place._id) ? 'var(--accent)' : 'var(--text-faint)'
                    }}
                    onClick={async (e) => {
                      e.stopPropagation();
                      await toggleWishlist(place._id);
                      toast(isWishlisted(place._id) ? '💔 Removed' : '❤️ Wishlisted!');
                    }}>
                    {isWishlisted(place._id) ? '❤️' : '🤍'}
                  </button>
                </div>
              </motion.div>
            ))}
            {places.length === 0 && (
              <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>No places found for {stateName}.</p>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {profileOpen && <ProfileSidebar onClose={() => setProfileOpen(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import ProfileSidebar from '../components/ProfileSidebar';
import { usePlaces } from '../context/PlacesContext';

const categoryEmoji = { mountain: '🏔️', beach: '🏖️', hillstation: '⛰️', monument: '🏛️', island: '🏝️', wildlife: '🦁', food: '🍛', amusement: '🎡', city: '🌆' };

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = usePlaces();
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setProfileOpen(true);
    window.addEventListener('openProfile', handler);
    return () => window.removeEventListener('openProfile', handler);
  }, []);

  return (
    <div className="list-page">
      <Navbar />
      <div className="list-header">
        <div className="list-title">
          <FiHeart style={{ color: 'var(--accent)', flexShrink: 0 }} /> My Wishlist
        </div>
        <div className="list-subtitle">
          {wishlist.length} place{wishlist.length !== 1 ? 's' : ''} you dream of visiting
        </div>
      </div>

      <div className="list-content">
        {wishlist.length === 0 ? (
          <motion.div className="empty-state" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="empty-state-icon">❤️</div>
            <div className="empty-state-text">Your wishlist is empty</div>
            <div className="empty-state-sub">Search for places and hit the ❤️ Wishlist button</div>
            <button className="btn-gold" style={{ marginTop: 20 }} onClick={() => navigate('/explore')}>
              Explore Places
            </button>
          </motion.div>
        ) : (
          <div className="list-grid">
            <AnimatePresence>
              {wishlist.map((place, i) => (
                <motion.div key={place._id}
                  className="place-card-h"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: i * 0.04 }}
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
                      <div style={{ fontSize: '0.72rem', color: 'var(--green)', marginTop: 4 }}>🗓 {place.bestSeason}</div>
                    )}
                  </div>
                  <div className="place-card-h-actions">
                    <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', padding: 8, borderRadius: '50%', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
                      title="Remove from wishlist"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await toggleWishlist(place._id);
                        toast('💔 Removed from wishlist');
                      }}>
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {profileOpen && <ProfileSidebar onClose={() => setProfileOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
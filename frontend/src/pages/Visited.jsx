import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckSquare, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import ProfileSidebar from '../components/ProfileSidebar';
import { usePlaces } from '../context/PlacesContext';

const categoryEmoji = { mountain: '🏔️', beach: '🏖️', hillstation: '⛰️', monument: '🏛️', island: '🏝️', wildlife: '🦁', food: '🍛', amusement: '🎡', city: '🌆' };

export default function Visited() {
  const navigate = useNavigate();
  const { visited, toggleVisited } = usePlaces();
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
        <div className="list-title" style={{ color: 'var(--green)' }}>
          <FiCheckSquare style={{ color: 'var(--green)', flexShrink: 0 }} /> Places Visited
        </div>
        <div className="list-subtitle">
          {visited.length} place{visited.length !== 1 ? 's' : ''} you've been to
        </div>
      </div>

      <div className="list-content">
        {visited.length === 0 ? (
          <motion.div className="empty-state" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="empty-state-icon">✅</div>
            <div className="empty-state-text">No visited places yet</div>
            <div className="empty-state-sub">Mark places as visited from the map or place detail page</div>
            <button className="btn-gold" style={{ marginTop: 20 }} onClick={() => navigate('/home')}>
              Open Map
            </button>
          </motion.div>
        ) : (
          <div className="list-grid">
            <AnimatePresence>
              {visited.map((place, i) => (
                <motion.div key={place._id}
                  className="place-card-h"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
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
                      title="Unmark as visited"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await toggleVisited(place._id);
                        toast('Removed from visited');
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

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiX, FiHeart, FiCheck, FiNavigation, FiBookOpen } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { usePlaces } from '../context/PlacesContext';

const categoryEmoji = {
  mountain: '🏔️', beach: '🏖️', hillstation: '⛰️', monument: '🏛️',
  island: '🏝️', wildlife: '🦁', food: '🍛', amusement: '🎡', city: '🌆',
};

export default function FloatingCard({ place, onClose }) {
  const navigate = useNavigate();
  const { isWishlisted, isVisited, visiting, toggleWishlist, toggleVisited, startVisiting } = usePlaces();

  if (!place) return null;

  const wishlisted = isWishlisted(place._id);
  const visited = isVisited(place._id);
  const isVisiting = visiting?.placeId?._id === place._id || visiting?.placeId === place._id;

  const handleWishlist = async () => {
    await toggleWishlist(place._id);
    toast(wishlisted ? '💔 Removed from Wishlist' : '❤️ Added to Wishlist!');
  };
  const handleVisited = async () => {
    await toggleVisited(place._id);
    toast(visited ? '✔ Unmarked as Visited' : '✅ Marked as Visited!');
  };
  const handleVisiting = async () => {
    if (isVisiting) { navigate('/visiting'); return; }
    await startVisiting(place._id, new Date().toISOString());
    toast(`📍 Now visiting ${place.name}!`);
    navigate('/visiting');
  };

  return (
    <AnimatePresence>
      <motion.div
        className="floating-card-wrap"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="floating-card">
          <button className="fc-close" onClick={onClose}><FiX /></button>

          {place.imageUrl
            ? <img src={place.imageUrl} alt={place.name} className="fc-image"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            : null}
          <div className="fc-image-fallback" style={{ display: place.imageUrl ? 'none' : 'flex' }}>
            {categoryEmoji[place.category] || '📍'}
          </div>

          <div className="fc-body">
            <div className="fc-name">{place.name}</div>
            <div className="fc-state">{place.state}</div>
            <div className="fc-desc">{place.shortDescription || place.description}</div>

            <div className="fc-actions">
              <div className="fc-row">
                <button className={`fc-btn ${wishlisted ? 'active-wish' : ''}`} onClick={handleWishlist}>
                  <FiHeart /> {wishlisted ? 'Wishlisted' : 'Wishlist'}
                </button>
                <button className={`fc-btn ${visited ? 'active-visit' : ''}`} onClick={handleVisited}>
                  <FiCheck /> {visited ? 'Visited' : 'Visited?'}
                </button>
                <button className={`fc-btn ${isVisiting ? 'active-visiting' : ''}`} onClick={handleVisiting}>
                  <FiNavigation /> {isVisiting ? 'Journaling' : 'Visiting'}
                </button>
              </div>
              <button className="fc-know-more" onClick={() => navigate(`/place/${place._id}`)}>
                <FiBookOpen style={{ marginRight: 5 }} /> Know More
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
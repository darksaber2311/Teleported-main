import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHeart, FiCheck, FiNavigation, FiCalendar, FiMap } from 'react-icons/fi';
import Calendar from 'react-calendar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { usePlaces } from '../context/PlacesContext';
import Navbar from '../components/Navbar';
import { AnimatePresence } from 'framer-motion';
import ProfileSidebar from '../components/ProfileSidebar';

const API = 'http://localhost:5000/api';

export default function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isWishlisted, isVisited, visiting, toggleWishlist, toggleVisited, startVisiting } = usePlaces();

  const [place, setPlace] = useState(null);
  const [notes, setNotes] = useState('');
  const [saveTimer, setSaveTimer] = useState(null);
  const [calDate, setCalDate] = useState(new Date());
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setProfileOpen(true);
    window.addEventListener('openProfile', handler);
    return () => window.removeEventListener('openProfile', handler);
  }, []);

  useEffect(() => {
    axios.get(`${API}/places/${id}`).then(r => setPlace(r.data)).catch(() => navigate('/home'));
    axios.get(`${API}/user/profile`).then(r => {
      const saved = r.data.notes?.[id];
      if (saved) setNotes(saved);
    }).catch(() => { });
  }, [id, navigate]);

  const wishlisted = place && isWishlisted(place._id);
  const visited = place && isVisited(place._id);
  const isVisiting = place && (visiting?.placeId?._id === place._id || visiting?.placeId === place._id);

  const handleNotesChange = (e) => {
    const val = e.target.value;
    setNotes(val);
    clearTimeout(saveTimer);
    setSaveTimer(setTimeout(() => {
      axios.put(`${API}/user/notes/${id}`, { notes: val }).catch(() => { });
    }, 900));
  };

  const handleWishlist = async () => {
    await toggleWishlist(place._id);
    toast(wishlisted ? '💔 Removed from wishlist' : '❤️ Added to wishlist!');
  };
  const handleVisited = async () => {
    await toggleVisited(place._id);
    toast(visited ? '✔ Unmarked as visited' : '✅ Marked as visited!');
  };
  const handleVisiting = async () => {
    if (isVisiting) { navigate('/visiting'); return; }
    await startVisiting(place._id, new Date().toISOString());
    toast(`📍 Now visiting ${place.name}!`);
    navigate('/visiting');
  };

  if (!place) return (
    <div className="detail-page" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Loading place…</div>
    </div>
  );

  const heroImg = place.imageUrl || (place.photos?.[0]);

  return (
    <motion.div className="detail-page"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>

      <Navbar />

      {/* Scrollable content area */}
      <div className="detail-scroll-area">

        {/* Hero — scrolls with content */}
        <div className="detail-hero" style={{ marginTop: 'var(--navbar-h)' }}>
          {heroImg
            ? <img src={heroImg} alt={place.name} className="detail-hero-img" />
            : <div className="detail-hero-img" style={{ background: 'linear-gradient(135deg,#1a2a45,#0d1b2e)' }} />}
          <div className="detail-hero-overlay" />
          <button className="detail-back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft size={13} /> Back
          </button>
        </div>

        {/* Sticky name + state bar */}
        <div className="detail-sticky-name">
          <div className="detail-sticky-inner">
            <div className="detail-place-name">{place.name}</div>
            <div className="detail-place-state">{place.state}</div>
          </div>
        </div>

        {/* Action bar */}
        <div className="detail-action-bar">
          <button className={`detail-action-btn ${wishlisted ? 'active-wish' : ''}`} onClick={handleWishlist}>
            <FiHeart size={14} /> {wishlisted ? 'Wishlisted ✓' : 'Add to Wishlist'}
          </button>
          <button className={`detail-action-btn ${visited ? 'active-visit' : ''}`} onClick={handleVisited}>
            <FiCheck size={14} /> {visited ? 'Visited ✓' : 'Mark Visited'}
          </button>
          <button className={`detail-action-btn ${isVisiting ? 'active-visiting' : ''}`} onClick={handleVisiting}>
            <FiNavigation size={14} /> {isVisiting ? 'View Journal' : 'Start Visiting'}
          </button>
          <button className="detail-action-btn detail-action-map"
            onClick={() => navigate(`/home?place=${place._id}`)}
            title="Show on Map">
            <FiMap size={14} /> Show on Map
          </button>
          <button className="detail-action-btn" style={{ marginLeft: 'auto' }}
            onClick={() => navigate(`/state/${encodeURIComponent(place.state)}`)}>
            🗺️ Explore {place.state}
          </button>
        </div>

        {/* Body */}
        <div className="detail-body">
          {/* Main */}
          <div className="detail-main">
            <div className="detail-section-title">About</div>
            <div className="detail-description">{place.description}</div>

            {place.photos?.length > 0 && (
              <>
                <div className="detail-section-title">Photos</div>
                <div className="detail-photos-grid" style={{ marginBottom: 24 }}>
                  {place.photos.map((url, i) => (
                    <img key={i} src={url} alt={`${place.name} ${i + 1}`} className="detail-photo"
                      onError={e => e.target.style.display = 'none'} />
                  ))}
                </div>
              </>
            )}

            {place.popularActivities?.length > 0 && (
              <>
                <div className="detail-section-title">Popular Activities</div>
                <div className="detail-activities">
                  {place.popularActivities.map((a, i) => (
                    <span key={i} className="activity-tag">{a}</span>
                  ))}
                </div>
              </>
            )}

            {place.bestSeason && (
              <>
                <div className="detail-section-title">Best Time to Visit</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--green)', fontSize: '0.9rem', marginBottom: 20, fontFamily: 'DM Sans, sans-serif' }}>
                  <FiCalendar /> {place.bestSeason}
                </div>
              </>
            )}

            <div className="detail-section-title">My Notes & Remarks</div>
            <textarea
              className="notes-textarea"
              placeholder="Add your thoughts, tips, to-dos or interesting facts about this place…"
              value={notes}
              onChange={handleNotesChange}
            />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: 4 }}>Auto-saved</div>
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            <div className="detail-section-title">Calendar</div>
            <Calendar onChange={setCalDate} value={calDate} />

            {place.wishlistCount > 0 && (
              <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Sans, sans-serif', fontWeight: 700 }}>Community</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 16 }}>
                  <div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent)' }}>
                      {place.wishlistCount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Wishlisted</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: 'var(--green)' }}>
                      {(place.visitedCount || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Visited</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>{/* end detail-scroll-area */}

      <AnimatePresence>
        {profileOpen && <ProfileSidebar onClose={() => setProfileOpen(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiMoon, FiSun, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { usePlaces } from '../context/PlacesContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ProfileSidebar({ onClose }) {
  const { user, logout, updateUser } = useAuth();
  const { dark, toggle }             = useTheme();
  const { wishlist, visited, visiting } = usePlaces();
  const navigate                     = useNavigate();
  const fileRef                       = useRef(null);

  const initial = user?.username?.[0]?.toUpperCase() || '?';

  const handleLogout = () => { logout(); onClose(); navigate('/'); toast.info('Logged out. See you soon! 👋'); };

  const handleDarkToggle = async () => {
    toggle();
    try { await axios.put('http://localhost:5000/api/user/profile', { darkMode: !dark }); } catch {}
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result;
      try {
        updateUser({ profilePic: base64 });
        await axios.put('http://localhost:5000/api/user/profile', { profilePic: base64 });
        toast.success('Profile picture updated!');
      } catch { toast.error('Failed to update picture'); }
    };
    reader.readAsDataURL(file);
  };

  const visitingPlace = visiting?.placeId;

  return (
    <motion.div
      className="profile-sidebar-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="profile-sidebar"
        initial={{ x: 340 }}
        animate={{ x: 0 }}
        exit={{ x: 340 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar-wrap">
            {user?.profilePic
              ? <img src={user.profilePic} alt="avatar" className="profile-avatar" />
              : <div className="profile-avatar-placeholder">{initial}</div>
            }
            <button className="profile-avatar-edit" onClick={() => fileRef.current?.click()}>
              <FiEdit2 size={10} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarChange} />
          </div>
          <div className="profile-user-info">
            <div className="profile-username">{user?.username || 'Traveller'}</div>
            <div className="profile-email">{user?.email || ''}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-section">
          <div className="profile-section-title">Your Journey</div>
          <div className="profile-stat-row">
            <div className="profile-stat-card" onClick={() => { onClose(); navigate('/wishlist'); }}>
              <div className="profile-stat-num">{wishlist.length}</div>
              <div className="profile-stat-label">Wishlisted</div>
            </div>
            <div className="profile-stat-card" onClick={() => { onClose(); navigate('/visited'); }}>
              <div className="profile-stat-num">{visited.length}</div>
              <div className="profile-stat-label">Visited</div>
            </div>
            <div className="profile-stat-card" onClick={() => { onClose(); navigate('/visiting'); }}>
              <div className="profile-stat-num">{visitingPlace ? 1 : 0}</div>
              <div className="profile-stat-label">Visiting</div>
            </div>
          </div>
        </div>

        {/* Wishlist thumbnails */}
        {wishlist.length > 0 && (
          <div className="profile-section">
            <div className="profile-section-title">Wishlist Preview</div>
            <div className="profile-thumbnails">
              {wishlist.slice(0, 4).map(p => (
                p.imageUrl
                  ? <img key={p._id} src={p.imageUrl} alt={p.name} className="profile-thumb" />
                  : <div key={p._id} className="profile-thumb-fallback">📍</div>
              ))}
              {wishlist.length > 4 && (
                <div className="profile-thumb-more">+{wishlist.length - 4}</div>
              )}
            </div>
          </div>
        )}

        {/* Currently visiting */}
        {visitingPlace && (
          <div className="profile-section">
            <div className="profile-section-title">Currently Visiting</div>
            <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}
              onClick={() => { onClose(); navigate('/visiting'); }}>
              {visitingPlace.imageUrl
                ? <img src={visitingPlace.imageUrl} alt={visitingPlace.name} className="profile-thumb" style={{ width:52, height:42 }} />
                : <div className="profile-thumb-fallback" style={{ width:52, height:42 }}>📍</div>
              }
              <div>
                <div style={{ fontSize:'0.88rem', fontWeight:600 }}>{visitingPlace.name}</div>
                <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{visitingPlace.state}</div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance */}
        <div className="profile-section">
          <div className="profile-section-title">Appearance</div>
          <div className="dark-mode-row">
            <span className="dark-mode-label">
              {dark ? <FiMoon size={15} /> : <FiSun size={15} />}
              {dark ? 'Dark Mode' : 'Light Mode'}
            </span>
            <label className="toggle-switch">
              <input type="checkbox" checked={dark} onChange={handleDarkToggle} />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Logout */}
        <button className="profile-logout-btn" onClick={handleLogout}>
          <FiLogOut /> Log Out
        </button>
      </motion.div>
    </motion.div>
  );
}

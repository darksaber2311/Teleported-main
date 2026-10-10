import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post('http://localhost:5000/api/auth/login', form);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.username}!`);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ── LEFT: Earth Animation ── */}
      <div className="auth-left">
        <video
          src="/earthAnimation.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="auth-left-brand">
          <h2>Explore the World,<br />One Pin at a Time.</h2>
          <p>Your travel dreams, mapped.</p>
        </div>
      </div>

      {/* ── RIGHT: Login Form ── */}
      <div className="auth-right">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="auth-logo">
            <h1>Teleported</h1>
            <p>Welcome back, traveler ✈️</p>
          </div>

          <div className="auth-title">Sign in</div>
          <div className="auth-subtitle">Enter your credentials to continue your journey</div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                className="form-input"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input
                  className="form-input"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="eye-btn" onClick={() => setShowPwd(s => !s)}>
                  {showPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {error && <div className="form-error" style={{ marginBottom: 14 }}>{error}</div>}

            <button
              className="auth-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <div className="auth-footer">
            New to Teleported?{' '}
            <span
              style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => navigate('/signup')}
            >
              Create an account →
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

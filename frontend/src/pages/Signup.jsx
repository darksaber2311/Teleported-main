import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const PasswordRule = ({ ok, text }) => (
  <div className={`pwd-rule ${ok ? 'ok' : 'err'}`}>
    {ok ? <FiCheck size={11} /> : <FiX size={11} />}
    {text}
  </div>
);

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const p = form.password;
  const rules = {
    length: p.length >= 8,
    special: /[!@#$%^&*(),.?":{}|<>]/.test(p),
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Object.values(rules).every(Boolean)) return setError('Please meet all password requirements');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    try {
      setLoading(true);
      const { data } = await axios.post('http://localhost:5000/api/auth/signup', {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login(data.token, data.user);
      toast.success(`Welcome aboard, ${data.user.username}!`);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed');
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
          <h2>Begin Your Journey<br />Today.</h2>
          <p>Map your wishlist. Track your adventures.</p>
        </div>
      </div>

      {/* ── RIGHT: Signup Form ── */}
      <div className="auth-right">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="auth-logo">
            <h1>Teleported</h1>
            <p>Your travel dreams, mapped ✈️</p>
          </div>

          <div className="auth-title">Create account</div>
          <div className="auth-subtitle">Join thousands of travelers exploring India</div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                className="form-input"
                name="username"
                placeholder="Enter Username"
                value={form.username}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                className="form-input"
                name="email"
                type="email"
                placeholder="Enter Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input
                  className="form-input"
                  name="password"
                  type={show.password ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="eye-btn" onClick={() => setShow(s => ({ ...s, password: !s.password }))}>
                  {show.password ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {form.password && (
                <div className="password-rules">
                  <PasswordRule ok={rules.length} text="At least 8 characters" />
                  <PasswordRule ok={rules.special} text="One special character (!@#$…)" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <input
                  className="form-input"
                  name="confirm"
                  type={show.confirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="eye-btn" onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}>
                  {show.confirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {form.confirm && form.password !== form.confirm && (
                <div className="form-error">Passwords don't match</div>
              )}
            </div>

            {error && <div className="form-error" style={{ marginBottom: 14 }}>{error}</div>}

            <button
              className="auth-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <span
              style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => navigate('/')}
            >
              Sign in →
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX } from 'react-icons/fi';
import Calendar from 'react-calendar';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import ProfileSidebar from '../components/ProfileSidebar';
import { usePlaces } from '../context/PlacesContext';

const STICKY_COLORS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff', '#fed7aa'];

function StickyNote({ note, onUpdate, onDelete }) {
  const [pos, setPos] = useState({ x: note.x, y: note.y });
  const [text, setText] = useState(note.text);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  };
  const handleMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const nx = e.clientX - offset.current.x;
    const ny = e.clientY - offset.current.y;
    setPos({ x: nx, y: ny });
  }, []);
  const handleMouseUp = useCallback(() => {
    if (dragging.current) {
      dragging.current = false;
      onUpdate({ ...note, x: pos.x, y: pos.y, text });
    }
  }, [note, pos, text, onUpdate]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleTextBlur = () => onUpdate({ ...note, x: pos.x, y: pos.y, text });

  return (
    <motion.div
      className="sticky-note"
      style={{ left: pos.x, top: pos.y, background: note.color, transform: `rotate(${note.rotation}deg)` }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      onMouseDown={handleMouseDown}
    >
      <div className="sticky-note-header">
        <button className="sticky-note-del" onClick={() => onDelete(note.id)}>✕</button>
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={handleTextBlur}
        placeholder="Write a note…"
        rows={5}
      />
    </motion.div>
  );
}

export default function Visiting() {
  const navigate = useNavigate();
  const { visiting, stopVisiting, updateDay } = usePlaces();

  const [activeDay, setActiveDay] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [days, setDays] = useState([]);
  const [todoInput, setTodoInput] = useState('');
  const [calDate, setCalDate] = useState(new Date());

  // Sync days from visiting context
  useEffect(() => {
    if (visiting?.days) setDays(visiting.days.map(d => ({ ...d, stickyNotes: d.stickyNotes || [], todos: d.todos || [] })));
  }, [visiting]);

  useEffect(() => {
    const handler = () => setProfileOpen(true);
    window.addEventListener('openProfile', handler);
    return () => window.removeEventListener('openProfile', handler);
  }, []);

  const currentDay = days[activeDay];
  const place = visiting?.placeId;

  // Auto-save current day after 1s debounce
  const saveTimer = useRef(null);
  const saveDay = useCallback((dayData) => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      updateDay(dayData).catch(() => { });
    }, 800);
  }, [updateDay]);

  const updateCurrentDay = (changes) => {
    const updated = { ...currentDay, ...changes };
    const newDays = days.map((d, i) => i === activeDay ? updated : d);
    setDays(newDays);
    saveDay(updated);
  };

  const addDay = () => {
    const newDay = {
      dayNumber: days.length + 1,
      date: new Date().toISOString(),
      stickyNotes: [], photos: [], foods: [], todos: [], freeText: '',
    };
    const newDays = [...days, newDay];
    setDays(newDays);
    setActiveDay(newDays.length - 1);
    updateDay(newDay);
  };

  const addSticky = () => {
    const note = {
      id: Date.now().toString(),
      text: '',
      color: STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)],
      x: 60 + Math.random() * 200,
      y: 60 + Math.random() * 150,
      rotation: (Math.random() - 0.5) * 8,
    };
    updateCurrentDay({ stickyNotes: [...(currentDay?.stickyNotes || []), note] });
  };

  const updateNote = (updated) => {
    const stickyNotes = (currentDay?.stickyNotes || []).map(n => n.id === updated.id ? updated : n);
    updateCurrentDay({ stickyNotes });
  };

  const deleteNote = (id) => {
    const stickyNotes = (currentDay?.stickyNotes || []).filter(n => n.id !== id);
    updateCurrentDay({ stickyNotes });
  };

  const addTodo = () => {
    if (!todoInput.trim()) return;
    const todos = [...(currentDay?.todos || []), { text: todoInput.trim(), done: false }];
    updateCurrentDay({ todos });
    setTodoInput('');
  };

  const toggleTodo = (idx) => {
    const todos = (currentDay?.todos || []).map((t, i) => i === idx ? { ...t, done: !t.done } : t);
    updateCurrentDay({ todos });
  };

  const handleStop = async () => {
    await stopVisiting();
    toast('✅ Journey ended — added to your Visited list!');
    navigate('/visited');
  };

  // Empty state
  if (!visiting || !place) {
    return (
      <div className="visiting-page">
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ fontSize: '3rem' }}>🗺️</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)' }}>Not visiting anywhere right now</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Find a place on the map and hit "Visiting" to start your journal</div>
          <button className="btn-gold" onClick={() => navigate('/home')}>Open Map</button>
        </div>
        <AnimatePresence>
          {profileOpen && <ProfileSidebar onClose={() => setProfileOpen(false)} />}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="visiting-page">
      <Navbar />

      {/* Header */}
      <div className="visiting-header">
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent)', letterSpacing: '-0.02em' }}>
          ✈️ Journey Journal
        </div>
        <div className="visiting-place-info">
          {place.imageUrl && (
            <img src={place.imageUrl} alt={place.name} className="visiting-place-img"
              onError={e => e.target.style.display = 'none'} />
          )}
          <div>
            <div className="visiting-place-name">{place.name}</div>
            <div className="visiting-place-state">{place.state}</div>
          </div>
          <button className="visiting-stop-btn" onClick={handleStop}>
            <FiX size={12} style={{ marginRight: 4 }} /> End Journey
          </button>
        </div>
      </div>

      {/* Day tabs */}
      <div className="day-tabs">
        {days.map((d, i) => (
          <button
            key={i}
            className={`day-tab ${activeDay === i ? 'active' : ''}`}
            onClick={() => setActiveDay(i)}
          >
            Day {d.dayNumber}
          </button>
        ))}
        <button className="day-tab-add" onClick={addDay}>
          <FiPlus size={12} /> Add Day
        </button>
      </div>

      {/* Body */}
      {currentDay ? (
        <div className="visiting-body">
          {/* Canvas area */}
          <div className="visiting-canvas">
            <div className="sticky-notes-area">
              <AnimatePresence>
                {currentDay.stickyNotes?.map(note => (
                  <StickyNote key={note.id} note={note} onUpdate={updateNote} onDelete={deleteNote} />
                ))}
              </AnimatePresence>
            </div>

            {/* Freetext area */}
            <div style={{ position: 'absolute', bottom: 70, left: 20, right: 20 }}>
              <textarea
                className="notes-textarea"
                placeholder={`Write about Day ${currentDay.dayNumber}…`}
                value={currentDay.freeText || ''}
                onChange={e => updateCurrentDay({ freeText: e.target.value })}
                style={{ minHeight: 80 }}
              />
            </div>

            <button className="add-sticky-btn" onClick={addSticky}>
              <FiPlus size={13} /> Add Sticky Note
            </button>
          </div>

          {/* Right sidebar */}
          <div className="visiting-right">
            {/* Calendar */}
            <div className="visiting-right-section">
              <div className="detail-section-title" style={{ marginBottom: 10 }}>Calendar</div>
              <Calendar onChange={setCalDate} value={calDate} />
            </div>

            {/* To-do */}
            <div className="visiting-right-section">
              <div className="detail-section-title" style={{ marginBottom: 10 }}>To-Do</div>
              {currentDay.todos?.map((todo, idx) => (
                <div key={idx} className="todo-item">
                  <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(idx)} />
                  <span className={`todo-item-text ${todo.done ? 'done' : ''}`}>{todo.text}</span>
                </div>
              ))}
              <div className="todo-add-row">
                <input
                  className="todo-input"
                  placeholder="Add a to-do…"
                  value={todoInput}
                  onChange={e => setTodoInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTodo()}
                />
                <button className="todo-add-btn" onClick={addTodo}>+</button>
              </div>
            </div>

            {/* Food section */}
            <div className="visiting-right-section">
              <div className="detail-section-title" style={{ marginBottom: 10 }}>🍽️ Food Log</div>
              {currentDay.foods?.map((f, i) => (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', padding: '4px 0', display: 'flex', gap: 8, fontFamily: 'DM Sans, sans-serif' }}>
                  <span>{f.emoji || '🍽️'}</span>
                  <span>{f.name}</span>
                </div>
              ))}
              <button
                className="btn-ghost"
                style={{ marginTop: 8, fontSize: '0.75rem', padding: '6px 12px' }}
                onClick={() => {
                  const name = prompt('What did you eat?');
                  if (!name) return;
                  const foods = [...(currentDay.foods || []), { name, emoji: '🍽️' }];
                  updateCurrentDay({ foods });
                }}
              >
                + Log Food
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button className="btn-gold" onClick={addDay}>Start Day 1</button>
        </div>
      )}

      <AnimatePresence>
        {profileOpen && <ProfileSidebar onClose={() => setProfileOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

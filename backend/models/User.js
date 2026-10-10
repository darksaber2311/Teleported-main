const mongoose = require('mongoose');

const stickyNoteSchema = new mongoose.Schema({
  id: String,
  text: { type: String, default: '' },
  color: { type: String, default: '#fef08a' },
  x: { type: Number, default: 100 },
  y: { type: Number, default: 100 },
  rotation: { type: Number, default: 0 },
});

const daySchema = new mongoose.Schema({
  dayNumber: Number,
  date: String,
  stickyNotes: [stickyNoteSchema],
  photos: [String],
  foods: [{ name: String, emoji: String, note: String }],
  todos: [{ text: String, done: Boolean }],
  freeText: { type: String, default: '' },
});

const visitingSchema = new mongoose.Schema({
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
  startDate: String,
  days: [daySchema],
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: '' },
    darkMode: { type: Boolean, default: true },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
    visited: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
    visiting: { type: visitingSchema, default: null },
    notes: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

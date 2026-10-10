const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, required: true },
  category: {
    type: String,
    enum: ['mountain', 'beach', 'hillstation', 'monument', 'island', 'wildlife', 'food', 'amusement', 'city'],
    required: true,
  },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  imageKeyword: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  photos: [String],
  popularActivities: [String],
  bestSeason: { type: String, default: '' },
  wishlistCount: { type: Number, default: 0 },
  visitedCount: { type: Number, default: 0 },
  trending: { type: Boolean, default: false },
});

placeSchema.index({ name: 'text', state: 'text' });

module.exports = mongoose.model('Place', placeSchema);
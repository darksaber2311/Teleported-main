const express = require('express');
const router = express.Router();
const Place = require('../models/Place');

// GET /api/places/popular
router.get('/popular', async (req, res) => {
  try {
    const places = await Place.find({ trending: true }).sort({ wishlistCount: -1 }).limit(12);
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/places/search?q=
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  try {
    const places = await Place.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { state: { $regex: q, $options: 'i' } },
      ],
    }).limit(10);
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/places/category/:category
router.get('/category/:category', async (req, res) => {
  try {
    const places = await Place.find({ category: req.params.category });
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/places/state/:stateName
router.get('/state/:stateName', async (req, res) => {
  try {
    const places = await Place.find({ state: { $regex: req.params.stateName, $options: 'i' } });
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/places/all  — all places (for explore)
router.get('/all', async (req, res) => {
  try {
    const places = await Place.find({}).sort({ wishlistCount: -1 });
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/places/:id
router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json(place);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
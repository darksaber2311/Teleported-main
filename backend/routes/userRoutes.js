const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Place = require('../models/Place');

// GET /api/user/profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('wishlist')
      .populate('visited')
      .populate('visiting.placeId');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/user/profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { profilePic, darkMode, username } = req.body;
    const update = {};
    if (profilePic !== undefined) update.profilePic = profilePic;
    if (darkMode !== undefined) update.darkMode = darkMode;
    if (username !== undefined) update.username = username;
    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/user/wishlist/:placeId — toggle wishlist
router.put('/wishlist/:placeId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const placeId = req.params.placeId;
    const idx = user.wishlist.findIndex(id => id.toString() === placeId);
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
      await Place.findByIdAndUpdate(placeId, { $inc: { wishlistCount: -1 } });
    } else {
      user.wishlist.push(placeId);
      await Place.findByIdAndUpdate(placeId, { $inc: { wishlistCount: 1 } });
    }
    await user.save();
    const populated = await User.findById(req.userId).select('-password').populate('wishlist').populate('visited');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/user/visited/:placeId — toggle visited
router.put('/visited/:placeId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const placeId = req.params.placeId;
    const idx = user.visited.findIndex(id => id.toString() === placeId);
    if (idx > -1) {
      user.visited.splice(idx, 1);
      await Place.findByIdAndUpdate(placeId, { $inc: { visitedCount: -1 } });
    } else {
      user.visited.push(placeId);
      await Place.findByIdAndUpdate(placeId, { $inc: { visitedCount: 1 } });
    }
    await user.save();
    const populated = await User.findById(req.userId).select('-password').populate('wishlist').populate('visited');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/user/visiting — set currently visiting place
router.put('/visiting', authMiddleware, async (req, res) => {
  try {
    const { placeId, startDate } = req.body;
    const user = await User.findById(req.userId);
    if (!placeId) {
      // Ending a journey — auto-add to visited if not already there
      const currentPlaceId = user.visiting?.placeId;
      if (currentPlaceId) {
        const alreadyVisited = user.visited.some(id => id.toString() === currentPlaceId.toString());
        if (!alreadyVisited) {
          user.visited.push(currentPlaceId);
          await Place.findByIdAndUpdate(currentPlaceId, { $inc: { visitedCount: 1 } });
        }
      }
      user.visiting = null;
    } else {
      user.visiting = { placeId, startDate: startDate || new Date().toISOString(), days: [{ dayNumber: 1, date: startDate || new Date().toISOString(), stickyNotes: [], photos: [], foods: [], todos: [], freeText: '' }] };
    }
    await user.save();
    await user.populate('visiting.placeId');
    res.json(user.visiting);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/user/visiting/day — add or update a day
router.put('/visiting/day', authMiddleware, async (req, res) => {
  try {
    const { dayNumber, date, stickyNotes, photos, foods, todos, freeText } = req.body;
    const user = await User.findById(req.userId);
    if (!user.visiting) return res.status(400).json({ message: 'Not currently visiting anywhere' });
    const dayIdx = user.visiting.days.findIndex(d => d.dayNumber === dayNumber);
    const dayData = { dayNumber, date, stickyNotes, photos, foods, todos, freeText };
    if (dayIdx > -1) {
      user.visiting.days[dayIdx] = dayData;
    } else {
      user.visiting.days.push(dayData);
    }
    user.markModified('visiting');
    await user.save();
    res.json(user.visiting);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/user/notes/:placeId
router.put('/notes/:placeId', authMiddleware, async (req, res) => {
  try {
    const { notes } = req.body;
    const user = await User.findById(req.userId);
    user.notes.set(req.params.placeId, notes);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

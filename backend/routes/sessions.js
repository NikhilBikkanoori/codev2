const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Session = require('../models/Session');

// Get all sessions for current user
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ student: req.user.id }, { counselor: req.user.id }]
    })
      .populate('student', 'name email')
      .populate('counselor', 'name email')
      .sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Schedule a new session
router.post('/', auth, async (req, res) => {
  try {
    const { counselorId, date, notes } = req.body;
    const session = new Session({
      student: req.user.id,
      counselor: counselorId,
      date,
      notes
    });
    await session.save();
    const populated = await Session.findById(session.id)
      .populate('student', 'name email')
      .populate('counselor', 'name email');
    res.json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update session status
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ msg: 'Session not found' });
    
    if (status) session.status = status;
    if (notes) session.notes = notes;
    
    await session.save();
    const populated = await Session.findById(session.id)
      .populate('student', 'name email')
      .populate('counselor', 'name email');
    res.json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

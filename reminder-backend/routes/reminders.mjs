import express from 'express';
const router = express.Router();

import Reminder from '../models/Reminder.mjs';
import parseReminder from '../services/parseReminder.mjs';

// POST /api/reminders - create a new reminder from natural language
router.post('/', async (req, res) => {
  console.log('Received POST:', req.body);

  const { message, userId = "guest" } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const parsed = await parseReminder(message);

    if (!parsed) {
      return res.status(500).json({ error: 'Failed to parse reminder' });
    }

    const reminder = new Reminder({
      userId,
      originalText: message,
      ...parsed,
    });

    const saved = await reminder.save();
    console.log('Saved to MongoDB:', saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving reminder:', err);
    res.status(500).json({ error: 'Failed to save reminder' });
  }
});

// GET /api/reminders - fetch all reminders with required fields
router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.find({
      task: { $exists: true },
      date: { $exists: true },
      time: { $exists: true },
    }).sort({ date: 1, time: 1 });

    res.json(reminders);
  } catch (err) {
    console.error('Error fetching reminders:', err);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

// PUT /api/reminders/:id/mark-paid - mark a reminder as paid
router.put('/:id/mark-paid', async (req, res) => {
  try {
    const updated = await Reminder.findByIdAndUpdate(
      req.params.id,
      { isPaid: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Error marking reminder as paid:', err);
    res.status(500).json({ error: 'Failed to mark as paid' });
  }
});

export default router;



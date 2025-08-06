import express from 'express';
const router = express.Router();
import Reminder from '../models/Reminder.mjs';
import parseReminder from '../services/parseReminder.mjs';


// POST /api/reminders
router.post('/', async (req, res) => {
  console.log('Received POST:', req.body);

  const { message, userId = "guest" } = req.body;

  if (!message) return res.status(400).json({ error: 'Message is required' });

  const parsed = await parseReminder(message);

  if (!parsed) return res.status(500).json({ error: 'Failed to parse reminder' });

  const reminder = new Reminder({
    userId,
    originalText: message,
    ...parsed,
  });

  try {
    const saved = await reminder.save();
    res.status(201).json(saved);
    console.log("Saved to mongo");
  } catch (err) {
    res.status(500).json({ error: 'Failed to save reminder' });
  console.log("Failed to save");
  }
});

// GET /api/reminders
router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ createdAt: -1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

export default router;

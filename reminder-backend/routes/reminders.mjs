import express from 'express';
const router = express.Router();
import Reminder from '../models/Reminder.mjs';
import parseReminder from '../services/parseReminder.mjs';


// POST /api/reminders

router.post('/', async (req, res) => {
  console.log('🔥 Received reminder:', req.body); // ✅ Debug log

  const { original, task, date } = req.body;

  if (!original || !task || !date) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const reminder = new Reminder({ original, task, date });
    await reminder.save();
    console.log('✅ Reminder saved to MongoDB:', reminder);
    res.status(200).json({ message: 'Reminder saved' });
  } catch (err) {
    console.error('❌ Error saving reminder:', err);
    res.status(500).json({ error: 'Failed to save reminder' });
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

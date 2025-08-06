import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  userId: String,
  originalText: String,
  task: String,
  date: String,
  time: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Reminder', reminderSchema);

import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  userId: String,
  originalText: String,
  task: String,
  date: String,
  time: String,
  dueDate: Date, // Added dueDate field to store the reminder deadline
  isPaid: {
    type: Boolean,
    default: false, // Initially unpaid
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Reminder', reminderSchema);


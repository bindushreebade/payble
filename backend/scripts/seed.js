const mongoose = require('mongoose');
require('dotenv').config();

const Transaction = require('../models/Transaction');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const dummyTransactions = [
  { userId: 'USER123', amount: 250, category: 'Food', date: new Date('2025-06-15') },
  { userId: 'USER123', amount: 400, category: 'Transport', date: new Date('2025-07-10') },
  { userId: 'USER123', amount: 600, category: 'Shopping', date: new Date('2025-08-01') },
  { userId: 'USER123', amount: 100, category: 'Bills', date: new Date('2025-08-02') },
];

async function seedDB() {
  try {
    await Transaction.deleteMany({ userId: 'USER123' });
    await Transaction.insertMany(dummyTransactions);
    console.log('🌱 Dummy data inserted');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedDB();

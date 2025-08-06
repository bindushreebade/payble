const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  category: String,
  date: Date,
});

module.exports = mongoose.model('Transaction', transactionSchema);

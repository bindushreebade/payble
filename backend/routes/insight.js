const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const transactions = await Transaction.find({ userId });
    console.log("📦 Fetched transactions:", transactions);

    const monthlyTotals = Array(12).fill(0);
    const categoryTotals = {};
    const targetYear = 2025;

    transactions.forEach((txn) => {
      const txnDate = new Date(txn.date);
      console.log("📅 Transaction date:", txnDate); // 👈 log dates
      const year = txnDate.getFullYear();
      const month = txnDate.getMonth();

      if (year === targetYear) {
        monthlyTotals[month] += txn.amount;

        if (!categoryTotals[txn.category]) {
          categoryTotals[txn.category] = 0;
        }
        categoryTotals[txn.category] += txn.amount;
      }
    });

    const currentMonth = new Date().getMonth();
    const wittyRemark = monthlyTotals[currentMonth] > 1000
      ? "Whoa, big spender this month! 💸"
      : "Nice, you're keeping things under control! 🧠";

    console.log("📊 monthlyTotals:", monthlyTotals);
    console.log("📈 categoryTotals:", categoryTotals);
    console.log("🧠 wittyRemark:", wittyRemark);

    res.json({ monthlyTotals, categoryTotals, wittyRemark });

  } catch (err) {
    console.error("❌ Error in insight route:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

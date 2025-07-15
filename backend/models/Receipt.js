const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  imageUrl: String,
  rawText: String,
  extractedItems: [String],
  healthAlerts: [String],
  categories: Object,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Receipt', receiptSchema);

const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
  roll: { type: String, required: true },
  total: { type: Number, required: true },
  paid: { type: Number, required: true }
});

module.exports = mongoose.model('Fee', FeeSchema);

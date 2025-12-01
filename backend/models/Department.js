const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  id: { type: String, unique: true, sparse: true },
  description: { type: String },
  hod: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Department', DepartmentSchema);

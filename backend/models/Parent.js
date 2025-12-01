const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pid: { type: String, required: true, unique: true },
  parentId: { type: String, unique: true, sparse: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  linkedStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Parent', ParentSchema);

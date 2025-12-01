const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll: { type: String, required: true, unique: true },
  email: { type: String },
  phone: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ['Male','Female','Other',''] },
  address: { type: String },
  deptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileName: { type: String },
  fileData: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);

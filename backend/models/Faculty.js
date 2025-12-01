const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  fid: { type: String, required: true, unique: true },
  email: { type: String },
  phone: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ['Male','Female','Other',''] },
  address: { type: String },
  deptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  salary: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Faculty', FacultySchema);

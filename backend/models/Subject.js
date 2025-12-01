const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  deptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  credits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subject', SubjectSchema);

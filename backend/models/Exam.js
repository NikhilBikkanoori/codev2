const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  roll: { type: String, required: true },
  subject: { type: String, required: true },
  examName: { type: String, required: true },
  marks: { type: Number, required: true }
});

module.exports = mongoose.model('Exam', ExamSchema);

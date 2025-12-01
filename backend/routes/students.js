const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Exam = require('../models/Exam');
const Fee = require('../models/Fee');
const User = require('../models/User');

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildMatchers = (user) => {
  const matchers = [];
  if (user?.email) matchers.push({ email: new RegExp(`^${escapeRegex(user.email.trim())}$`, 'i') });
  if (user?.name) matchers.push({ name: new RegExp(`^${escapeRegex(user.name.trim())}$`, 'i') });
  return matchers;
};

const resolveStudentByUser = async (userId) => {
  if (!userId) return null;
  let student = await Student.findOne({ userId });
  if (student) return student;

  const user = await User.findById(userId).select('email name role');
  if (!user || user.role !== 'student') return null;

  const matchers = buildMatchers(user);
  for (const filter of matchers) {
    const candidate = await Student.findOne(filter);
    if (candidate) {
      if (!candidate.userId) {
        candidate.userId = userId;
        await candidate.save();
      }
      return candidate;
    }
  }

  return null;
};

// Get current student profile (linked via User ID from auth token)
router.get('/me', auth, async (req, res) => {
  try {
    const baseStudent = await resolveStudentByUser(req.user.id);
    if (!baseStudent) {
      return res.status(404).json({ msg: 'Student profile not found' });
    }

    const student = await Student.findById(baseStudent._id)
      .populate('deptId', 'name')
      .populate('parentId', 'name pid phone')
      .populate('mentorId', 'name fid email phone');
    
    res.json(student);
  } catch (err) {
    console.error('Get student profile error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get student attendance (linked via Student roll)
router.get('/me/attendance', auth, async (req, res) => {
  try {
    const student = await resolveStudentByUser(req.user.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    
    const records = await Attendance.find({ studentRoll: student.roll });
    
    // Calculate attendance percentage
    const total = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    res.json({ records, total, present, percentage });
  } catch (err) {
    console.error('Get attendance error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get student exams and marks
router.get('/me/exams', auth, async (req, res) => {
  try {
    const student = await resolveStudentByUser(req.user.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    
    const exams = await Exam.find({ roll: student.roll });
    
    // Calculate GPA (simple average of marks / 10)
    let totalMarks = 0;
    exams.forEach(e => { totalMarks += e.marks || 0; });
    const gpa = exams.length > 0 ? (totalMarks / exams.length / 10).toFixed(2) : 0;
    
    res.json({ exams, count: exams.length, gpa });
  } catch (err) {
    console.error('Get exams error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get student fees
router.get('/me/fees', auth, async (req, res) => {
  try {
    const student = await resolveStudentByUser(req.user.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    
    const fees = await Fee.find({ roll: student.roll });
    
    // Sum up total and paid
    let totalFee = 0, paidFee = 0;
    fees.forEach(f => {
      totalFee += f.total || 0;
      paidFee += f.paid || 0;
    });
    const pending = totalFee - paidFee;
    
    res.json({ fees, total: totalFee, paid: paidFee, pending });
  } catch (err) {
    console.error('Get fees error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

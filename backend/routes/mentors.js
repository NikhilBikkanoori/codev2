const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Exam = require('../models/Exam');
const Fee = require('../models/Fee');

// Get current mentor profile (linked via User ID from auth token)
router.get('/me', auth, async (req, res) => {
  try {
    // Find faculty by userId (from authenticated token)
    const faculty = await Faculty.findOne({ userId: req.user.id })
      .populate('deptId', 'name');
    
    if (!faculty) {
      return res.status(404).json({ msg: 'Mentor profile not found' });
    }
    
    res.json(faculty);
  } catch (err) {
    console.error('Get mentor profile error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get assigned students (students from same department)
router.get('/me/students', auth, async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.user.id });
    if (!faculty) return res.status(404).json({ msg: 'Mentor not found' });
    
    // Get all students in the same department
    const students = await Student.find({ deptId: faculty.deptId })
      .populate('deptId', 'name')
      .populate('parentId', 'name pid phone')
      .populate('mentorId', 'name fid email phone');
    
    res.json({ count: students.length, students });
  } catch (err) {
    console.error('Get assigned students error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get student details by roll (for mentor feedback)
router.get('/me/students/:roll', auth, async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.user.id });
    if (!faculty) return res.status(404).json({ msg: 'Mentor not found' });
    
    const student = await Student.findOne({ roll: req.params.roll })
      .populate('deptId', 'name')
      .populate('parentId', 'name pid phone')
      .populate('mentorId', 'name fid email phone');
    
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    
    // Verify student is in same department
    if (String(student.deptId._id) !== String(faculty.deptId)) {
      return res.status(403).json({ msg: 'Cannot access student from different department' });
    }
    
    // Fetch related data
    const attendance = await Attendance.find({ studentRoll: student.roll });
    const exams = await Exam.find({ roll: student.roll });
    const fees = await Fee.find({ roll: student.roll });
    
    // Calculate metrics
    const attTotal = attendance.length;
    const attPresent = attendance.filter(a => a.status === 'Present').length;
    const attPercentage = attTotal > 0 ? Math.round((attPresent / attTotal) * 100) : 0;
    
    let totalMarks = 0;
    exams.forEach(e => { totalMarks += e.marks || 0; });
    const gpa = exams.length > 0 ? (totalMarks / exams.length / 10).toFixed(2) : 0;
    
    let totalFee = 0, paidFee = 0;
    fees.forEach(f => {
      totalFee += f.total || 0;
      paidFee += f.paid || 0;
    });
    
    res.json({
      student,
      metrics: {
        attendance: { percentage: attPercentage, present: attPresent, total: attTotal },
        exams: { count: exams.length, gpa, records: exams },
        fees: { total: totalFee, paid: paidFee, pending: totalFee - paidFee }
      }
    });
  } catch (err) {
    console.error('Get student details error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get department statistics (for mentor dashboard overview)
router.get('/me/stats', auth, async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.user.id });
    if (!faculty) return res.status(404).json({ msg: 'Mentor not found' });
    
    const students = await Student.find({ deptId: faculty.deptId });
    const studentCount = students.length;
    
    // Get average metrics
    let totalAttPercentage = 0, totalGPA = 0;
    for (const s of students) {
      const att = await Attendance.find({ studentRoll: s.roll });
      const attPresent = att.filter(a => a.status === 'Present').length;
      totalAttPercentage += att.length > 0 ? (attPresent / att.length) * 100 : 0;
      
      const exams = await Exam.find({ roll: s.roll });
      let totalMarks = 0;
      exams.forEach(e => { totalMarks += e.marks || 0; });
      totalGPA += exams.length > 0 ? (totalMarks / exams.length / 10) : 0;
    }
    
    const avgAttendance = studentCount > 0 ? Math.round(totalAttPercentage / studentCount) : 0;
    const avgGPA = studentCount > 0 ? (totalGPA / studentCount).toFixed(2) : 0;
    
    res.json({
      studentCount,
      avgAttendance,
      avgGPA,
      deptId: faculty.deptId
    });
  } catch (err) {
    console.error('Get stats error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

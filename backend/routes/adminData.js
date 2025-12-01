const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('fast-csv');
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Parent = require('../models/Parent');
const Department = require('../models/Department');
const Attendance = require('../models/Attendance');
const Exam = require('../models/Exam');
const Fee = require('../models/Fee');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const mongoose = require('mongoose');
const User = require('../models/User');

// Admin guard
function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });
  next();
}

// CSV upload setup
const upload = multer({ storage: multer.memoryStorage() });

// Generic helpers
function asyncHandler(fn){ return (req,res,next)=> Promise.resolve(fn(req,res,next)).catch(next); }

// Students CRUD
router.get('/students', auth, adminOnly, asyncHandler(async (req,res)=>{
  const items = await Student.find()
    .populate('parentId','name pid phone')
    .populate('mentorId','name fid email phone')
    .populate('deptId','name');
  res.json(items);
}));
router.post('/students', auth, adminOnly, asyncHandler(async (req,res)=>{
  const { roll, name } = req.body;
  if(!roll || !name) return res.status(400).json({ msg: 'Name and roll required' });
  const exists = await Student.findOne({ roll });
  if(exists) return res.status(400).json({ msg: 'Roll already exists' });
  try {
    const s = await Student.create(req.body);
    res.status(201).json(s);
  } catch(err){
    console.error('Student create error:', err.message);
    if(err.name === 'ValidationError') return res.status(400).json({ msg: 'Invalid student data' });
    res.status(500).json({ msg: 'Student create failed' });
  }
}));
router.put('/students/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!updated) return res.status(404).json({ msg: 'Student not found' });
  res.json(updated);
}));
router.delete('/students/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const removed = await Student.findByIdAndDelete(req.params.id);
  if(!removed) return res.status(404).json({ msg: 'Student not found' });
  res.json({ msg: 'Student deleted' });
}));

// CSV import students
router.post('/students/import', auth, adminOnly, upload.single('file'), asyncHandler(async (req,res)=>{
  if(!req.file) return res.status(400).json({ msg: 'No file uploaded' });
  const rows = [];
  csv.parseString(req.file.buffer.toString('utf-8'), { headers: true, ignoreEmpty: true })
    .on('error', err => res.status(400).json({ msg: 'CSV parse error', error: err.message }))
    .on('data', data => rows.push(data))
    .on('end', async () => {
      const inserted = [];
      for(const r of rows){
        if(!r.roll || !r.name) continue;
        const exists = await Student.findOne({ roll: r.roll });
        if(exists) continue;
        inserted.push(await Student.create({
          roll: r.roll,
            name: r.name,
            email: r.email || '',
            phone: r.phone || '',
            gender: r.gender || '',
            address: r.address || ''
        }));
      }
      res.json({ imported: inserted.length });
    });
}));

// Faculty CRUD
router.get('/faculty', auth, adminOnly, asyncHandler(async (req,res)=>{
  const items = await Faculty.find().populate('deptId','name');
  res.json(items);
}));
router.post('/faculty', auth, adminOnly, asyncHandler(async (req,res)=>{
  const f = await Faculty.create(req.body);
  res.status(201).json(f);
}));
router.put('/faculty/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const updated = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!updated) return res.status(404).json({ msg: 'Faculty not found' });
  res.json(updated);
}));
router.delete('/faculty/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const removed = await Faculty.findByIdAndDelete(req.params.id);
  if(!removed) return res.status(404).json({ msg: 'Faculty not found' });
  res.json({ msg: 'Faculty deleted' });
}));

// Parents CRUD
router.get('/parents', auth, adminOnly, asyncHandler(async (req,res)=>{
  const items = await Parent.find().populate('linkedStudent','name roll');
  res.json(items);
}));
router.post('/parents', auth, adminOnly, asyncHandler(async (req,res)=>{
  const p = await Parent.create(req.body);
  res.status(201).json(p);
}));
router.put('/parents/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const updated = await Parent.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!updated) return res.status(404).json({ msg: 'Parent not found' });
  res.json(updated);
}));
router.delete('/parents/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const removed = await Parent.findByIdAndDelete(req.params.id);
  if(!removed) return res.status(404).json({ msg: 'Parent not found' });
  res.json({ msg: 'Parent deleted' });
}));

// Departments CRUD
router.get('/departments', auth, adminOnly, asyncHandler(async (req,res)=>{
  const items = await Department.find().populate('hod','name fid');
  res.json(items);
}));
router.post('/departments', auth, adminOnly, asyncHandler(async (req,res)=>{
  const d = await Department.create(req.body);
  res.status(201).json(d);
}));
router.put('/departments/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const updated = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!updated) return res.status(404).json({ msg: 'Department not found' });
  res.json(updated);
}));
router.delete('/departments/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const removed = await Department.findByIdAndDelete(req.params.id);
  if(!removed) return res.status(404).json({ msg: 'Department not found' });
  res.json({ msg: 'Department deleted' });
}));

// Attendance CRUD
router.get('/attendance', auth, adminOnly, asyncHandler(async (req,res)=>{
  const items = await Attendance.find();
  res.json(items);
}));
router.post('/attendance', auth, adminOnly, asyncHandler(async (req,res)=>{
  const a = await Attendance.create(req.body);
  res.status(201).json(a);
}));
router.put('/attendance/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const updated = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!updated) return res.status(404).json({ msg: 'Attendance record not found' });
  res.json(updated);
}));
router.delete('/attendance/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const removed = await Attendance.findByIdAndDelete(req.params.id);
  if(!removed) return res.status(404).json({ msg: 'Attendance record not found' });
  res.json({ msg: 'Attendance deleted' });
}));

// Exams CRUD
router.get('/exams', auth, adminOnly, asyncHandler(async (req,res)=>{
  const items = await Exam.find();
  res.json(items);
}));
router.post('/exams', auth, adminOnly, asyncHandler(async (req,res)=>{
  const e = await Exam.create(req.body);
  res.status(201).json(e);
}));
router.put('/exams/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const updated = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!updated) return res.status(404).json({ msg: 'Exam record not found' });
  res.json(updated);
}));
router.delete('/exams/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const removed = await Exam.findByIdAndDelete(req.params.id);
  if(!removed) return res.status(404).json({ msg: 'Exam record not found' });
  res.json({ msg: 'Exam deleted' });
}));

// Fees CRUD
router.get('/fees', auth, adminOnly, asyncHandler(async (req,res)=>{
  const items = await Fee.find();
  res.json(items);
}));
router.post('/fees', auth, adminOnly, asyncHandler(async (req,res)=>{
  const f = await Fee.create(req.body);
  res.status(201).json(f);
}));
router.put('/fees/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const updated = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!updated) return res.status(404).json({ msg: 'Fee record not found' });
  res.json(updated);
}));
router.delete('/fees/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const removed = await Fee.findByIdAndDelete(req.params.id);
  if(!removed) return res.status(404).json({ msg: 'Fee record not found' });
  res.json({ msg: 'Fee deleted' });
}));

// Courses CRUD
router.get('/courses', auth, adminOnly, asyncHandler(async (req,res)=>{
  const items = await Course.find().populate('deptId','name');
  res.json(items);
}));
router.post('/courses', auth, adminOnly, asyncHandler(async (req,res)=>{
  const c = await Course.create(req.body);
  res.status(201).json(c);
}));
router.put('/courses/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!updated) return res.status(404).json({ msg: 'Course not found' });
  res.json(updated);
}));
router.delete('/courses/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const removed = await Course.findByIdAndDelete(req.params.id);
  if(!removed) return res.status(404).json({ msg: 'Course not found' });
  res.json({ msg: 'Course deleted' });
}));

// Subjects CRUD
router.get('/subjects', auth, adminOnly, asyncHandler(async (req,res)=>{
  const items = await Subject.find().populate('deptId','name').populate('courseId','name code');
  res.json(items);
}));
router.post('/subjects', auth, adminOnly, asyncHandler(async (req,res)=>{
  const s = await Subject.create(req.body);
  res.status(201).json(s);
}));
router.put('/subjects/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!updated) return res.status(404).json({ msg: 'Subject not found' });
  res.json(updated);
}));
router.delete('/subjects/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const removed = await Subject.findByIdAndDelete(req.params.id);
  if(!removed) return res.status(404).json({ msg: 'Subject not found' });
  res.json({ msg: 'Subject deleted' });
}));

// Admin management create/delete (constraints: cannot delete last or self)
router.post('/admins', auth, adminOnly, asyncHandler(async (req,res)=>{
  const { name, email, password } = req.body;
  if(!name || !email || !password) return res.status(400).json({ msg: 'Missing fields' });
  const existing = await User.findOne({ email });
  if(existing) return res.status(400).json({ msg: 'Email already exists' });
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hashed, role: 'admin' });
  res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
}));
router.delete('/admins/:id', auth, adminOnly, asyncHandler(async (req,res)=>{
  const target = await User.findById(req.params.id);
  if(!target || target.role !== 'admin') return res.status(404).json({ msg: 'Admin not found' });
  const adminCount = await User.countDocuments({ role: 'admin' });
  if(adminCount <= 1) return res.status(400).json({ msg: 'Cannot delete last admin' });
  if(target.id === req.user.id) return res.status(400).json({ msg: 'Cannot delete currently logged-in admin' });
  await target.deleteOne();
  res.json({ msg: 'Admin deleted' });
}));

// Admin list (users with role admin)
router.get('/admins', auth, adminOnly, asyncHandler(async (req,res)=>{
  const admins = await User.find({ role: 'admin' }).select('-password');
  res.json(admins);
}));

// Global export JSON
router.get('/export/all', auth, adminOnly, asyncHandler(async (req,res)=>{
  const [students, faculty, parents, departments, attendance, exams, fees, courses, subjects, admins] = await Promise.all([
    Student.find(),
    Faculty.find(),
    Parent.find(),
    Department.find(),
    Attendance.find(),
    Exam.find(),
    Fee.find(),
    Course.find(),
    Subject.find(),
    User.find({ role: 'admin' }).select('-password')
  ]);
  res.json({ students, faculty, parents, departments, attendance, exams, fees, courses, subjects, admins });
}));

module.exports = router;

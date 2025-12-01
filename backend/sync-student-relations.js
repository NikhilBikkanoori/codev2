require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');
const Parent = require('./models/Parent');
const Faculty = require('./models/Faculty');
const Department = require('./models/Department');

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getNested = (record, path) => {
  if (!record || !path) return undefined;
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), record);
};

const pickField = (record, keys = []) => {
  for (const key of keys) {
    const value = getNested(record, key);
    if (value !== undefined && value !== null) {
      const str = typeof value === 'string' ? value.trim() : value;
      if (str !== '' && str !== null && str !== undefined) return value;
    }
  }
  return undefined;
};

const sanitizeString = (value) => {
  if (value === undefined || value === null) return undefined;
  const str = String(value).trim();
  return str.length === 0 ? undefined : str;
};

const DEPT_FIELDS = ['deptId.name', 'department', 'Department', 'Dept', 'Dept Name'];
const PARENT_NAME_FIELDS = ['parentId.name', 'parentName', 'Parent Name', 'parent_name'];
const PARENT_PHONE_FIELDS = ['parentId.phone', 'parentPhone', 'Parent Number', 'parent_number'];
const PARENT_EMAIL_FIELDS = ['parentId.email', 'parentEmail', 'Parent Email'];
const PARENT_ADDRESS_FIELDS = ['parentId.address', 'parentAddress', 'Parent Address', 'address', 'Address'];
const MENTOR_NAME_FIELDS = ['mentorId.name', 'mentorName', 'Mentor Name', 'mentor_name'];

const deptCache = new Map();
const mentorCache = new Map();
let newDepartments = 0;
let newParents = 0;
let newMentors = 0;

const ensureDepartment = async (nameRaw) => {
  const name = sanitizeString(nameRaw);
  if (!name) return null;
  const key = name.toLowerCase();
  if (deptCache.has(key)) return deptCache.get(key);

  let dept = await Department.findOne({ name: new RegExp(`^${escapeRegex(name)}$`, 'i') });
  if (!dept) {
    const codeBase = name.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase();
    const code = codeBase || `DEPT-${await Department.countDocuments() + newDepartments + 1}`;
    dept = await Department.create({ name, code, id: code });
    newDepartments += 1;
    console.log(`• Created department ${name} (${code})`);
  } else if (!dept.id && dept.code) {
    dept.id = dept.code;
    await dept.save();
  }

  deptCache.set(key, dept);
  return dept;
};

const generatePid = async (student) => {
  const base = sanitizeString(student.roll) || sanitizeString(student['Student Id']) || student._id.toString().slice(-6);
  const slug = (base || 'PARENT').replace(/[^A-Za-z0-9]/g, '').toUpperCase() || 'PARENT';
  let candidate = `PID-${slug}`;
  let counter = 1;
  while (await Parent.exists({ pid: candidate })) {
    candidate = `PID-${slug}-${counter++}`;
  }
  return candidate;
};

const ensureParent = async (student, raw) => {
  const name = sanitizeString(pickField(raw, PARENT_NAME_FIELDS));
  if (!name) return null;
  const phone = sanitizeString(pickField(raw, PARENT_PHONE_FIELDS));
  const email = sanitizeString(pickField(raw, PARENT_EMAIL_FIELDS));
  const address = sanitizeString(pickField(raw, PARENT_ADDRESS_FIELDS));

  let parent = await Parent.findOne({ linkedStudent: student._id });
  if (!parent) {
    parent = await Parent.findOne({ name: new RegExp(`^${escapeRegex(name)}$`, 'i') });
  }

  if (!parent) {
    const pid = await generatePid(student);
    parent = await Parent.create({
      name,
      pid,
      parentId: pid,
      phone,
      email,
      address,
      linkedStudent: student._id
    });
    newParents += 1;
    console.log(`• Created parent record for ${name} (student ${student.roll || student._id})`);
    return parent;
  }

  const updates = {};
  if (!parent.linkedStudent) updates.linkedStudent = student._id;
  if (!parent.pid || !parent.parentId) {
    const pid = await generatePid(student);
    if (!parent.pid) updates.pid = pid;
    if (!parent.parentId) updates.parentId = pid;
  }
  if (!parent.phone && phone) updates.phone = phone;
  if (!parent.email && email) updates.email = email;
  if (!parent.address && address) updates.address = address;
  if (!parent.name && name) updates.name = name;

  if (Object.keys(updates).length) {
    parent.set(updates);
    await parent.save();
  }
  return parent;
};

const generateFid = async (mentorName) => {
  const slug = (slugify(mentorName).toUpperCase() || 'MENTOR').slice(0, 32);
  let candidate = slug || 'MENTOR';
  let counter = 1;
  while (await Faculty.exists({ fid: candidate })) {
    candidate = `${slug}-${counter++}`;
  }
  return candidate;
};

const ensureMentor = async (nameRaw, dept) => {
  const name = sanitizeString(nameRaw);
  if (!name) return null;
  const key = name.toLowerCase();
  if (mentorCache.has(key)) return mentorCache.get(key);

  let mentor = await Faculty.findOne({ name: new RegExp(`^${escapeRegex(name)}$`, 'i') });
  if (!mentor) {
    mentor = await Faculty.create({
      name,
      fid: await generateFid(name),
      deptId: dept ? dept._id : undefined
    });
    newMentors += 1;
    console.log(`• Created mentor record for ${name}${dept ? ` (dept ${dept.name})` : ''}`);
  } else if (dept && !mentor.deptId) {
    mentor.deptId = dept._id;
    await mentor.save();
  }

  mentorCache.set(key, mentor);
  return mentor;
};

(async function syncRelations() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dropshield';
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected. Syncing relations based on student dataset...');

    const students = await Student.find();
    let linkedDepartments = 0;
    let linkedParents = 0;
    let linkedMentors = 0;

    for (const student of students) {
      const raw = student.toObject();
      const updates = {};

      const deptName = pickField(raw, DEPT_FIELDS);
      const dept = await ensureDepartment(deptName);
      if (dept && (!student.deptId || String(student.deptId) !== String(dept._id))) {
        updates.deptId = dept._id;
        linkedDepartments += 1;
      }

      const parent = await ensureParent(student, raw);
      if (parent && (!student.parentId || String(student.parentId) !== String(parent._id))) {
        updates.parentId = parent._id;
        linkedParents += 1;
      }

      const mentorName = pickField(raw, MENTOR_NAME_FIELDS);
      const mentor = await ensureMentor(mentorName, dept);
      if (mentor && (!student.mentorId || String(student.mentorId) !== String(mentor._id))) {
        updates.mentorId = mentor._id;
        linkedMentors += 1;
      }

      if (Object.keys(updates).length) {
        await Student.updateOne({ _id: student._id }, { $set: updates });
      }
    }

    console.log('\n=== Sync Summary ===');
    console.log(`Students processed: ${students.length}`);
    console.log(`Departments created: ${newDepartments}`);
    console.log(`Students linked to departments: ${linkedDepartments}`);
    console.log(`Parents created: ${newParents}`);
    console.log(`Students linked to parents: ${linkedParents}`);
    console.log(`Mentors created: ${newMentors}`);
    console.log(`Students linked to mentors: ${linkedMentors}`);
    console.log('====================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Sync failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
})();

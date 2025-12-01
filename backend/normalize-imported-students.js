require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');

const FALLBACK_KEYS = {
  name: ['Name', 'Student Name', 'studentName'],
  roll: ['Roll', 'Roll No', 'Roll Number', 'Student Id', 'Student ID', 'studentId', 'student_id'],
  email: ['Email', 'studentEmail', 'Email ID'],
  phone: ['Student Phone Number', 'Student Phone', 'Phone']
};

const pickValue = (record, keys) => {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return undefined;
};

(async function normalizeStudents() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dropshield';
  try {
    console.log('\n🔗 Connecting to MongoDB...');
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected. Inspecting student documents...');

    const students = await Student.find({});
    let updated = 0;

    for (const doc of students) {
      const raw = doc.toObject();
      const updates = {};

      if (!doc.name) {
        const fallback = pickValue(raw, FALLBACK_KEYS.name);
        if (fallback) updates.name = fallback;
      }

      if (!doc.roll) {
        const fallback = pickValue(raw, FALLBACK_KEYS.roll);
        if (fallback) updates.roll = fallback;
      }

      if (!doc.email) {
        const fallback = pickValue(raw, FALLBACK_KEYS.email);
        if (fallback) updates.email = fallback;
      }

      if (!doc.phone) {
        const fallback = pickValue(raw, FALLBACK_KEYS.phone);
        if (fallback) updates.phone = String(fallback);
      }

      if (Object.keys(updates).length > 0) {
        await Student.updateOne({ _id: doc._id }, { $set: updates });
        updated += 1;
        console.log(`• ${doc._id.toString()} ->`, updates);
      }
    }

    console.log(`\n✨ Normalization complete. Updated ${updated} of ${students.length} student records.`);
    if (updated === 0) {
      console.log('All documents already contain the canonical fields.');
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Normalization failed:', error.message);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
})();

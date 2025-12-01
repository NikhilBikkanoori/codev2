const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');
const Parent = require('./models/Parent');

async function checkDatabase() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dropshield';
    console.log('\n🔗 Connecting to MongoDB Atlas...');
    console.log('URI:', uri.split('@')[0] + '@****\n');
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB Atlas\n');

    // Check Users
    const userCount = await User.countDocuments();
    console.log(`📊 Users Collection: ${userCount} documents`);
    if (userCount > 0) {
      const users = await User.find().select('name email role');
      users.forEach((u, i) => {
        console.log(`   ${i + 1}. ${u.name} (${u.email}) - ${u.role}`);
      });
    } else {
      console.log('   ⚠️  NO DATA - Collection is empty');
    }

    // Check Students
    console.log(`\n👨‍🎓 Students Collection:`);
    const studentCount = await Student.countDocuments();
    console.log(`   ${studentCount} documents`);
    if (studentCount > 0) {
      const students = await Student.find().select('name roll email');
      students.forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.name} (${s.roll})`);
      });
    } else {
      console.log('   ⚠️  NO DATA - Collection is empty');
    }

    // Check Faculty
    console.log(`\n👨‍🏫 Faculty Collection:`);
    const facultyCount = await Faculty.countDocuments();
    console.log(`   ${facultyCount} documents`);
    if (facultyCount > 0) {
      const faculties = await Faculty.find().select('name fid email');
      faculties.forEach((f, i) => {
        console.log(`   ${i + 1}. ${f.name} (${f.fid})`);
      });
    } else {
      console.log('   ⚠️  NO DATA - Collection is empty');
    }

    // Check Parents
    console.log(`\n👨‍👩‍👧 Parents Collection:`);
    const parentCount = await Parent.countDocuments();
    console.log(`   ${parentCount} documents`);
    if (parentCount > 0) {
      const parents = await Parent.find().select('name pid email');
      parents.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} (${p.pid})`);
      });
    } else {
      console.log('   ⚠️  NO DATA - Collection is empty');
    }

    console.log('\n' + '='.repeat(60));
    console.log('TOTAL DATA SUMMARY:');
    console.log('='.repeat(60));
    console.log(`Users: ${userCount}`);
    console.log(`Students: ${studentCount}`);
    console.log(`Faculty: ${facultyCount}`);
    console.log(`Parents: ${parentCount}`);
    console.log('='.repeat(60));

    if (userCount === 0 && studentCount === 0 && facultyCount === 0 && parentCount === 0) {
      console.log('\n❌ Your MongoDB Atlas database is EMPTY!');
      console.log('\nTo populate data, you need to:');
      console.log('1. Create test data through the API (register/create users)');
      console.log('2. Use MongoDB Atlas UI to insert documents');
      console.log('3. Or run a setup script to seed data\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();

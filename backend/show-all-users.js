const mongoose = require('mongoose');
require('dotenv').config();

async function getAllUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    
    console.log('\n' + '='.repeat(70));
    console.log('ALL USERS IN MONGODB ATLAS - RAW DATA');
    console.log('='.repeat(70) + '\n');
    
    if (users.length === 0) {
      console.log('❌ No users found in database\n');
    } else {
      console.log(`✅ Total Users: ${users.length}\n`);
      
      users.forEach((u, i) => {
        console.log(`User ${i + 1}:`);
        console.log(`  Email: ${u.email || 'NOT SET'}`);
        console.log(`  Name: ${u.name || 'NOT SET'}`);
        console.log(`  Role: ${u.role || 'NOT SET'}`);
        console.log(`  ID: ${u._id}`);
        console.log('');
      });

      // Separate by role
      console.log('='.repeat(70));
      console.log('USERS BY ROLE');
      console.log('='.repeat(70) + '\n');

      const admins = users.filter(u => u.role === 'admin');
      const students = users.filter(u => u.role === 'student');
      const mentors = users.filter(u => u.role === 'mentor');

      if (admins.length > 0) {
        console.log('🔐 ADMIN USERS:');
        admins.forEach(a => {
          console.log(`  Email: ${a.email || 'NOT SET'}`);
          console.log(`  Name: ${a.name || 'NOT SET'}`);
        });
        console.log('');
      }

      if (students.length > 0) {
        console.log(`📚 STUDENTS (${students.length}):`);
        students.forEach(s => {
          console.log(`  Email: ${s.email || 'NOT SET'}`);
        });
        console.log('');
      }

      if (mentors.length > 0) {
        console.log(`👨‍🏫 MENTORS (${mentors.length}):`);
        mentors.forEach(m => {
          console.log(`  Email: ${m.email || 'NOT SET'}`);
        });
        console.log('');
      }
    }

    console.log('='.repeat(70));
    console.log('⚠️  IMPORTANT: Passwords are hashed in MongoDB');
    console.log('You can only see: Email, Name, and Role');
    console.log('='.repeat(70) + '\n');

    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

getAllUsers();

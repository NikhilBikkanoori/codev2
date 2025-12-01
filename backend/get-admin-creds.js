const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function getAdminCredentials() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dropshield';
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('🔐 ADMIN CREDENTIALS FROM MongoDB Atlas');
    console.log('='.repeat(60) + '\n');

    // Find all admin users
    const admins = await User.find({ role: 'admin' }).select('name email role');
    
    if (admins.length === 0) {
      console.log('❌ NO ADMIN USERS FOUND IN DATABASE\n');
    } else {
      console.log(`✅ Found ${admins.length} admin account(s):\n`);
      admins.forEach((admin, i) => {
        console.log(`Admin #${i + 1}:`);
        console.log(`  Username/Email: ${admin.email}`);
        console.log(`  Name: ${admin.name}`);
        console.log(`  Role: ${admin.role}`);
        console.log('  Password: ⚠️  NOT SHOWN (hashed in database)\n');
      });
    }

    // Find all students to show login options
    console.log('='.repeat(60));
    console.log('📚 ALL USERS IN DATABASE');
    console.log('='.repeat(60) + '\n');

    const allUsers = await User.find().select('name email role');
    
    allUsers.forEach((user, i) => {
      console.log(`${i + 1}. ${user.email} (${user.role})`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('ℹ️  NOTE: Passwords are hashed with bcryptjs');
    console.log('To get actual admin password, check with:');
    console.log('- Database creator/administrator');
    console.log('- MongoDB Atlas user management');
    console.log('- Try default passwords from your setup');
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

getAdminCredentials();

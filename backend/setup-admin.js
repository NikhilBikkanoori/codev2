const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  role: String,
});

const User = mongoose.model('User', userSchema);

async function setupAdminCredentials() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('\n' + '='.repeat(70));
    console.log('SETTING UP ADMIN CREDENTIALS');
    console.log('='.repeat(70) + '\n');

    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.log('❌ No admin user found. Creating new admin...\n');

      // Create admin matching frontend default login (admin / Admin123!)
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      const newAdmin = await User.create({
        email: 'admin@dropshield.local',
        name: 'Administrator',
        password: hashedPassword,
        role: 'admin',
      });

      console.log('✅ NEW ADMIN CREATED\n');
      console.log('Email: admin@dropshield.local');
      console.log('Password: Admin123!\n');
    } else {
      console.log('Found existing admin, updating credentials...\n');

      const hashedPassword = await bcrypt.hash('Admin123!', 10);

      admin.email = 'admin@dropshield.local';
      admin.name = 'Administrator';
      admin.password = hashedPassword;

      await admin.save();

      console.log('✅ ADMIN CREDENTIALS UPDATED\n');
      console.log('Email: admin@dropshield.local');
      console.log('Password: Admin123!\n');
    }

    console.log('='.repeat(70));
    console.log('✅ ADMIN SETUP COMPLETE - USE THESE TO LOGIN:');
    console.log('='.repeat(70));
    console.log('\n📧 Email: admin@dropshield.local');
    console.log('🔑 Password: Admin123!\n');
    console.log('='.repeat(70) + '\n');

    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

setupAdminCredentials();

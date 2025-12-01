const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  role: String,
});

const User = mongoose.model('User', userSchema);

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('\n' + '='.repeat(70));
    console.log('TESTING LOGIN - ADMIN CREDENTIALS');
    console.log('='.repeat(70) + '\n');

    // Find admin
    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.log('❌ No admin found');
      process.exit(1);
    }

    console.log('Admin found:');
    console.log(`  Email: ${admin.email}`);
    console.log(`  Name: ${admin.name}`);
    console.log(`  Password Hash: ${admin.password.substring(0, 30)}...`);
    console.log('');

    // Test with password we set
    const testPassword = 'Admin@123456';
    console.log(`Testing password: "${testPassword}"`);
    
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    
    if (isMatch) {
      console.log('✅ PASSWORD MATCHES!\n');
    } else {
      console.log('❌ PASSWORD DOES NOT MATCH\n');
      
      // Try creating new hash with same password and comparing
      console.log('Testing bcrypt directly...');
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log(`New hash: ${newHash.substring(0, 30)}...`);
      
      const match2 = await bcrypt.compare(testPassword, newHash);
      console.log(`Direct bcrypt test: ${match2 ? '✅ WORKS' : '❌ FAILS'}\n`);
    }

    console.log('='.repeat(70));
    console.log('LOGIN CREDENTIALS:');
    console.log('='.repeat(70));
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${testPassword}\n`);

    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

testLogin();

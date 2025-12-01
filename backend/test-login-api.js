const axios = require('axios');

async function testLoginAPI() {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('TESTING LOGIN API ENDPOINT');
    console.log('='.repeat(70) + '\n');

    const email = 'admin@dropshield.com';
    const password = 'Admin@123456';

    console.log(`Testing: POST http://localhost:5000/api/auth/login`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}\n`);

    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });

    console.log('✅ LOGIN SUCCESSFUL!\n');
    console.log('Response:');
    console.log(`  Token: ${response.data.token.substring(0, 50)}...`);
    console.log(`  User ID: ${response.data.user.id}`);
    console.log(`  User Name: ${response.data.user.name}`);
    console.log(`  User Email: ${response.data.user.email}`);
    console.log(`  User Role: ${response.data.user.role}\n`);

    console.log('='.repeat(70));
    console.log('✅ LOGIN API IS WORKING CORRECTLY');
    console.log('='.repeat(70) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ LOGIN FAILED\n');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data?.msg || error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to server on port 5000');
      console.error('Make sure backend server is running!');
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

testLoginAPI();

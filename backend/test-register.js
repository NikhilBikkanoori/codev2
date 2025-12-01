const axios = require('axios');
const crypto = require('crypto');

const API = process.env.API_URL || 'http://localhost:5000/api';

(async () => {
  try {
    const ts = Date.now();
    const email = `autotest_${ts}@example.com`;
    const pass = 'Test123!';
    console.log('API:', API);
    console.log('Registering with', email);

    const reg = await axios.post(`${API}/auth/register`, { name: 'Auto Test', email, password: pass, role: 'admin' });
    console.log('Register response:', reg.data);
    const token = reg.data.token;

    console.log('Fetching profile with token...');
    const prof = await axios.get(`${API}/users/profile`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Profile:', prof.data);

    console.log('Creating admin-data record...');
    try {
      const adm = await axios.post(`${API}/admin/data/admins`, { name: 'Auto Test', email, password: pass }, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Admin-data created:', adm.data);
    } catch (e) {
      console.warn('Admin-data creation failed:', e.response ? e.response.data : e.message);
    }

    console.log('\nTEST COMPLETE');
  } catch (err) {
    console.error('Test error:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
})();

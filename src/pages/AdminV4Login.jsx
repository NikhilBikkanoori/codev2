import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

// Legacy style admin login mapping username/password to existing email/password
// Username 'admin' maps to seeded admin email admin@dropshield.local
const AdminV4Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    // For now only admin user; could expand mapping later.
    const email = username === 'admin' ? 'admin@dropshield.local' : `${username}@dropshield.local`;
    const res = await login({ email, password });
    if(!res.success) setError(res.error); else if(res.user.role !== 'admin') setError('Not an admin account'); else navigate('/admin-v4');
    setLoading(false);
  };

  return (
    <div className='h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-96'>
        <h2 className='text-2xl font-bold text-center mb-4'>Admin v4 Login</h2>
        {error && <div className='bg-red-100 text-red-700 p-2 rounded text-sm mb-3'>{error}</div>}
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder='Username' className='w-full border p-2 rounded' required />
          <input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password' className='w-full border p-2 rounded' required />
          <button disabled={loading} className='w-full bg-purple-600 text-white py-2 rounded'>{loading? 'Signing in...' : 'Sign in'}</button>
          <p className='text-xs text-gray-500'>Default admin: admin / Admin123!</p>
        </form>
      </div>
    </div>
  );
};

export default AdminV4Login;

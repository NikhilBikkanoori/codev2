import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const NewAdmin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const identifier = username.trim();
      const result = await login({ identifier, password });
      if (!result.success) throw new Error(result.error || 'Login failed');
      if (result.user.role !== 'admin') throw new Error('Not an admin account');
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-96'>
        <h2 className='text-2xl font-bold text-center mb-4'>Admin Login</h2>
        {error && <div className='bg-red-100 text-red-700 p-2 rounded text-sm mb-3'>{error}</div>}
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Username'
            className='w-full border p-2 rounded'
            required
          />
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            className='w-full border p-2 rounded'
            required
          />
          <button disabled={loading} className='w-full bg-purple-600 text-white py-2 rounded'>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <p className='text-xs text-gray-500 text-center'>Default admin: admin / Admin123!</p>
        </form>
      </div>
    </div>
  );
};

export default NewAdmin;

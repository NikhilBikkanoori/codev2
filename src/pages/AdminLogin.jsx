import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@dropshield.local');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login({ email, password });
    if (result.success) {
      if (result.user.role !== 'admin') {
        setError('This account is not an admin.');
      } else {
        navigate('/admin');
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-96'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Admin Login</h2>
        {error && <div className='bg-red-100 text-red-700 p-2 rounded mb-4 text-sm'>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className='block text-sm font-medium mb-1'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full p-2 mb-4 border rounded'
            placeholder='admin email'
            required
          />
          <label className='block text-sm font-medium mb-1'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 mb-4 border rounded'
              placeholder='password'
              required
            />
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-800 disabled:opacity-50'
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <p className='text-xs text-gray-500 mt-4'>Default credentials are pre-filled.</p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

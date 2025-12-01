import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const MentorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login({ email, password });
    
    if (result.success) {
      navigate('/mentor-dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#192047', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI', sans-serif" }}>
      <header style={{ background: '#262C53', color: '#fff', padding: '15px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ background: 'linear-gradient(135deg, #192047, #A2F4F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '1.8em', fontWeight: 'bold' }}>DropShield</h1>
      </header>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div style={{ background: '#262C53', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 6px 18px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <h2 style={{ textAlign: 'center', color: '#A2F4F9', marginBottom: '1.5rem' }}>
            <i className="fas fa-chalkboard-teacher" style={{ marginRight: '0.5rem' }}></i> Mentor Login
          </h2>
          {error && <div style={{ background: '#ff4444', color: '#fff', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#A2F4F9', fontWeight: 500 }}>Email</label>
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%',color:'black', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }} required />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#A2F4F9', fontWeight: 500 }}>Password</label>
              <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%',color:'black', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }} required />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #192047, #262C53)', color: '#A2F4F9', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem', transition: 'all 0.3s ease', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.9rem' }}>
              <a href="#" style={{ color: '#A2F4F9', textDecoration: 'none' }}>Forgot Password?</a>
              <a href="/" style={{ color: '#A2F4F9', textDecoration: 'none' }}>Back to Home</a>
            </div>
          </form>
        </div>
      </div>

      <footer style={{ background: '#262C53', color: '#fff', textAlign: 'center', padding: '20px' }}>
        <p>&copy; 2025 Dropout Prediction & Counselling System</p>
      </footer>
    </div>
  );
};

export default MentorLogin;
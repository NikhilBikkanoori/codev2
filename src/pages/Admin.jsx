// Legacy admin component replaced by AdminPanel.
// Keeping file to avoid import errors; redirect user.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate('/admin'); }, [navigate]);
  return <div className="p-8 text-center text-sm text-gray-500">Redirecting to new admin panel...</div>;
};

export default Admin;
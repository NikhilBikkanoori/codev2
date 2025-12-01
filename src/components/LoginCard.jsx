import React from 'react';

const LoginCard = () => {
  return (
    <div className="bg-[var(--c3)] text-[var(--text-dark)] p-8 rounded-2xl shadow-xl text-center">
      <i className="fas fa-user-graduate text-3xl mb-4"></i>
      <h3 className="text-2xl font-semibold mb-4">Student Portal</h3>
      <p className="mb-6 text-sm">Track attendance, view scores, and get recommendations.</p>
      <a href="student/student-login.html" className="btn">
        <i className="fas fa-sign-in-alt"></i> Student Login
      </a>
    </div>
  );
};

export default LoginCard;
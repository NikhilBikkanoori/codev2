import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const styles = `
    :root {
      --c1: #192047;
      --c2: #FFD1D8;
      --c3: #262C53;
      --c4: #A2F4F9;
      --silver: rgba(192,192,192,0.7);
      --text-dark: #F7FAFC;
    }

    body {
      font-family: 'Segoe UI', sans-serif;
      background: var(--c1);
      color: var(--text-dark);
      margin: 0;
      padding: 0;
    }

    .home-header {
      background: var(--c3);
      padding: 15px 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 15px rgb(0,0,0,0.2);
    }

    .home-header h1 {
      background: linear-gradient(135deg, var(--c1), var(--c4));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-size: 1.8em;
      font-weight: bold;
    }

    .home-nav a {
      color: #fff;
      margin: 0 15px;
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s;
    }

    .home-nav a:hover {
      color: var(--c2);
    }

    .btn {
      background: linear-gradient(135deg, var(--c2), var(--c4));
      color: var(--c3);
      padding: 12px 24px;
      border-radius: 25px;
      font-weight: bold;
      transition: all 0.4s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      position: relative;
      overflow: hidden;
      border: none;
      cursor: pointer;
      text-decoration: none;
    }

    .btn:hover {
      transform: scale(1.08);
      background: linear-gradient(135deg, var(--c4), var(--c1));
      color: #ffffff;
      box-shadow: 0 8px 20px rgba(162, 244, 249, 0.3);
    }

    .btn:hover::after {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.15) 20%, transparent 70%);
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.9); opacity: 0.4; }
      100% { transform: scale(1.4); opacity: 0; }
    }

    .card {
      background: var(--c3);
      border-radius: 12px;
      padding: 1.5rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      color: var(--text-dark);
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.15);
    }

    section h2 {
      color: var(--c2);
    }

    footer {
      background: var(--c3);
      color: var(--c4);
      text-align: center;
      padding: 30px 20px;
      margin-top: 60px;
      border-top: 2px solid var(--c4);
    }

    footer a {
      color: var(--c4);
      font-weight: 600;
      text-decoration: none;
    }

    footer a:hover {
      text-decoration: underline;
    }
  `;

  return (
    <div className="min-h-screen" style={{ background: '#192047', color: '#F7FAFC' }}>
      <style>{styles}</style>

      {/* HEADER */}
      <header className="home-header">
        <h1>DropShield</h1>
        <nav className="home-nav">
          <Link to="/home">Home</Link>
          <Link to="/data-source-info">Data Source</Link>
          <Link to="/students-data">Students Data</Link>
          <Link to="/verify-data-source">Verify DB</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/newadmin">New Admin</Link>
          <Link to="/student-login">Login</Link>
          <a href="#features">Features</a>
          <a href="#stats">Statistics</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* RISK SECTION */}
       <main className="flex flex-col items-center px-6 py-12">
      <h1
        className="text-4xl font-extrabold text-center mb-12"
      >
        Spot risk early. Support every student.
      </h1>
      <p className="text-center max-w-2xl mb-10">
        A transparent system that consolidates attendance, marks, and fee data — applies thresholds and color-coded indicators — and sends timely alerts to mentors and guardians for early, data-driven intervention.
      </p>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl mb-12">
        <div className="card text-center p-6 rounded-lg shadow bg-white">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-bold mb-1 text-blue-400">Consolidated Data</h3>
          <p className="text-sm">Merge attendance, marks, and fees into one dashboard.</p>
        </div>
        <div className="card text-center p-6 rounded-lg shadow bg-white">
          <div className="text-3xl mb-3">⚠️</div>
          <h3 className="font-bold mb-1 text-blue-400">Rule-based Risk</h3>
          <p className="text-sm">Highlight at-risk students with clear thresholds.</p>
        </div>
        <div className="card text-center p-6 rounded-lg shadow bg-white">
          <div className="text-3xl mb-3">📩</div>
          <h3 className="font-bold mb-1 text-blue-400">Notifications</h3>
          <p className="text-sm">Auto-alert mentors & guardians on schedule.</p>
        </div>
        <div className="card text-center p-6 rounded-lg shadow bg-white">
          <div className="text-3xl mb-3">📝</div>
          <h3 className="font-bold mb-1 text-blue-400">Intervention Log</h3>
          <p className="text-sm">Track support actions & measure improvements.</p>
        </div>
      </div>
    </main>

      {/* LOGIN CARDS */}
      <section id="login" className="container mx-auto my-16 px-6">
        <h2 className="text-center mb-12" style={{ fontSize: '2rem' }}>Choose Your Role</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <i className="fas fa-graduation-cap" style={{ fontSize: '3rem', color: '#A2F4F9', marginBottom: '1rem' }}></i>
            <h3 style={{ color: '#FFD1D8', marginBottom: '1rem' }}>Student</h3>
            <p style={{ marginBottom: '1.5rem' }}>Track your academic progress and access counseling resources</p>
            <Link to="/student-login" className="btn">Student Login</Link>
          </div>

          <div className="card text-center">
            <i className="fas fa-chalkboard-teacher" style={{ fontSize: '3rem', color: '#A2F4F9', marginBottom: '1rem' }}></i>
            <h3 style={{ color: '#FFD1D8', marginBottom: '1rem' }}>Mentor</h3>
            <p style={{ marginBottom: '1.5rem' }}>Monitor your mentees and provide personalized guidance</p>
            <Link to="/mentor-login" className="btn">Mentor Login</Link>
          </div>

          <div className="card text-center">
            <i className="fas fa-user-shield" style={{ fontSize: '3rem', color: '#A2F4F9', marginBottom: '1rem' }}></i>
            <h3 style={{ color: '#FFD1D8', marginBottom: '1rem' }}>Parent</h3>
            <p style={{ marginBottom: '1.5rem' }}>Stay informed about your child's academic journey</p>
            <Link to="/parent-login" className="btn">Parent Login</Link>
          </div>
        </div>
      </section>

      {/* KEY FEATURES */}
      <section id="features" className="px-6 my-16 max-w-6xl mx-auto">
        <h2 className="text-center mb-12" style={{ fontSize: '2rem' }}>Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h3 style={{ color: '#A2F4F9' }}>
              <i className="fas fa-chart-line" style={{ marginRight: '0.5rem' }}></i>
              AI-Powered Risk Assessment
            </h3>
            <p>Analyze student data to predict dropout risk with high accuracy</p>
          </div>

          <div className="card">
            <h3 style={{ color: '#A2F4F9' }}>
              <i className="fas fa-users" style={{ marginRight: '0.5rem' }}></i>
              Mentor-Student Connection
            </h3>
            <p>Direct communication between mentors and at-risk students</p>
          </div>

          <div className="card">
            <h3 style={{ color: '#A2F4F9' }}>
              <i className="fas fa-calendar-check" style={{ marginRight: '0.5rem' }}></i>
              Attendance Tracking
            </h3>
            <p>Real-time attendance monitoring and alerts</p>
          </div>

          <div className="card">
            <h3 style={{ color: '#A2F4F9' }}>
              <i className="fas fa-headset" style={{ marginRight: '0.5rem' }}></i>
              Counselor Support
            </h3>
            <p>Connect students with professional counseling services</p>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section id="stats" className="px-6 my-16 max-w-6xl mx-auto text-center">
        <h2 className="mb-12" style={{ fontSize: '2rem' }}>Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card">
            <h3 style={{ fontSize: '2.5rem', color: '#A2F4F9', marginBottom: '0.5rem' }}>95%</h3>
            <p>Prediction Accuracy</p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '2.5rem', color: '#A2F4F9', marginBottom: '0.5rem' }}>10k+</h3>
            <p>Students Supported</p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '2.5rem', color: '#A2F4F9', marginBottom: '0.5rem' }}>500+</h3>
            <p>Mentors Active</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact">
        <p>&copy; 2025 Dropout Prediction &amp; Counselling System. All Rights Reserved.</p>
        <p>
          <a href="mailto:support@dropshield.local">Contact Us</a> |
          <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a> |
          <a href="/terms-of-service" target="_blank" rel="noreferrer">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
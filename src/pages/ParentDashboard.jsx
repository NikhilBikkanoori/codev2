import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);

  const styles = `
    :root {
      --bg: #192047;
      --card: #262C53;
      --soft: #1a2349;
      --muted: #9aa3be;
      --accent: #A2F4F9;
      --danger: #ff6b6b;
      --warning: #ffa500;
      --success: #51cf66;
      --c2: #FFD1D8;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: 'Inter', 'Segoe UI', sans-serif;
      background: var(--bg);
      color: white;
    }

    .topbar {
      background: var(--card);
      padding: 15px 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: rgba(255,255,255,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
    }

    .top-right {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .profile-mini {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255,255,255,0.12);
      padding: 6px 10px;
      border-radius: 999px;
      cursor: pointer;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--accent);
      color: var(--card);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }

    .container {
      display: flex;
      gap: 20px;
      padding: 28px;
      max-width: 1400px;
      margin: 90px auto 0 auto;
    }

    .main-content {
      flex: 1;
    }

    .card {
      background: var(--card);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .stat-box {
      background: var(--card);
      padding: 20px;
      border-radius: 12px;
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: var(--accent);
      margin: 10px 0;
    }

    .stat-label {
      color: var(--muted);
      font-size: 0.9rem;
    }

    .section-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: white;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .see-more {
      font-size: 0.85rem;
      color: var(--accent);
      cursor: pointer;
      text-decoration: none;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    th {
      color: var(--accent);
      font-weight: 600;
    }

    .btn {
      padding: 8px 16px;
      background: var(--accent);
      color: var(--card);
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(162, 244, 249, 0.3);
    }

    .profile-dropdown {
      position: absolute;
      top: 66px;
      right: 50px;
      background: var(--card);
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
      z-index: 1100;
      min-width: 180px;
    }

    .profile-dropdown a {
      display: block;
      padding: 10px;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      transition: background 0.2s;
      cursor: pointer;
    }

    .profile-dropdown a:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .alert-box {
      background: rgba(255, 107, 107, 0.1);
      border-left: 4px solid #ff6b6b;
      padding: 12px;
      margin-bottom: 12px;
      border-radius: 4px;
    }

    .alert-box.success {
      background: rgba(81, 207, 102, 0.1);
      border-left-color: #51cf66;
    }

    .greeting {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 28px;
      color: white;
    }
  `;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{styles}</style>

      {/* TOPBAR */}
      <div className="topbar">
        <div className="brand">
          <div className="logo">AIT</div>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.95 }}>Parent Portal</div>
            <div style={{ fontSize: '12px', opacity: 0.85 }}>ABC Institute of Technology</div>
          </div>
        </div>

        <div className="top-right">
          <div className="profile-mini" onClick={() => setProfileDropdownVisible(!profileDropdownVisible)}>
            <div className="avatar">M</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>Mr. Mehta</div>
              <small style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.85)' }}>Parent</small>
            </div>
          </div>
          {profileDropdownVisible && (
            <div className="profile-dropdown">
              <a href="/parent-profile">View Profile</a>
              <a href="/parent-settings">Settings</a>
              <a href="/" onClick={() => navigate('/')}>Logout</a>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container">
        <div className="main-content">
          <div className="greeting">Welcome Back, Mr. Mehta</div>

          {/* Child Status Overview */}
          <div className="grid">
            <div className="stat-box">
              <div className="stat-label">Child Name</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '8px' }}>Ravi Mehta</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Current GPA</div>
              <div className="stat-value">6.8</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Attendance</div>
              <div className="stat-value">60%</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Risk Level</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ff6b6b', marginTop: '8px' }}>High</div>
            </div>
          </div>

          {/* Alerts */}
          <div className="card">
            <h3 style={{ color: 'var(--accent)', marginTop: 0 }}>Important Alerts</h3>
            <div className="alert-box">
              <strong>⚠️ Low Attendance Alert:</strong> Your child's attendance is below 70%. Please encourage regular attendance.
            </div>
            <div className="alert-box">
              <strong>📉 Academic Performance:</strong> Recent test scores show a declining trend. Consider scheduling a mentor meeting.
            </div>
            <div className="alert-box success">
              <strong>✓ Positive News:</strong> Your child has completed all assignments on time this month!
            </div>
          </div>

          {/* Academic Performance */}
          <div className="card">
            <div className="section-title">
              Academic Performance
            </div>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Data Structures</td>
                  <td>68/100</td>
                  <td>C+</td>
                  <td style={{ color: 'var(--warning)' }}>Needs Improvement</td>
                </tr>
                <tr>
                  <td>Algorithms</td>
                  <td>65/100</td>
                  <td>C</td>
                  <td style={{ color: 'var(--warning)' }}>Needs Improvement</td>
                </tr>
                <tr>
                  <td>Database Systems</td>
                  <td>72/100</td>
                  <td>B-</td>
                  <td style={{ color: 'var(--success)' }}>Good</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mentor Communication */}
          <div className="card">
            <div className="section-title">
              Mentor Insights
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Last Update:</strong> November 18, 2025
            </div>
            <p>
              Prof. Sharma (Mentor): "Ravi has been attending classes regularly but seems to be struggling with complex concepts in Data Structures. I recommend scheduling a one-on-one session to clarify doubts."
            </p>
            <button className="btn">Message Mentor</button>
          </div>

          {/* Fees Status */}
          <div className="card">
            <div className="section-title">
              Fees Status
            </div>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Pending</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tuition Fees</td>
                  <td>$50,000</td>
                  <td style={{ color: 'var(--success)' }}>$20,000</td>
                  <td style={{ color: 'var(--danger)' }}>$30,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '40px' }}>
            <button className="btn" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentFetchProfile, studentFetchAttendance, studentFetchExams, studentFetchFees } from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [notificationPanelVisible, setNotificationPanelVisible] = useState(false);
  const [activePage, setActivePage] = useState('dashboardPage');
  const [unreadNotifications] = useState(3);
  
  // Student data
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [exams, setExams] = useState(null);
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setLoading(true);
        setError('');
        const [profRes, attRes, examRes, feeRes] = await Promise.all([
          studentFetchProfile(),
          studentFetchAttendance(),
          studentFetchExams(),
          studentFetchFees()
        ]);
        setStudent(profRes.data);
        setAttendance(attRes.data);
        setExams(examRes.data);
        setFees(feeRes.data);
      } catch (e) {
        console.error('Load student data error:', e);
        setError(e.response?.data?.msg || 'Failed to load student data');
      } finally {
        setLoading(false);
      }
    };
    loadStudentData();
  }, []);

  const mentorNotifications = [
    "Your mentor has reviewed your attendance.",
    "New counselling suggestion available.",
    "Please complete your weekly check-in."
  ];

  const navigateToPage = (pageId) => {
    setActivePage(pageId);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownVisible(!profileDropdownVisible);
  };

  const toggleNotificationPanel = () => {
    setNotificationPanelVisible(!notificationPanelVisible);
  };

  const styles = `
    :root{
      --bg: #192047;
      --purple: #A2F4F9;
      --purple-2: #262C53;
      --muted: #7b7b8a;
      --card: #262C53;
      --soft: #1a2349;
      --radius:14px;
      --text-dark: #F7FAFC;
      --c1: #192047;
      --c2: #FFD1D8;
      --c3: #262C53;
      --c4: #A2F4F9;
      --risk-high: #FF6B6B;
      --risk-medium: #FFD166;
      --risk-low: #06D6A0;
    }
    *{box-sizing:border-box}
    body{margin:0;font-family:Inter,Segoe UI,Helvetica,Arial; background:var(--bg); color:var(--text-dark);}
    
    /* Header */
    .topbar{
      background:var(--c3);
      color:#fff;padding:18px 28px;display:flex;align-items:center;justify-content:space-between;
      box-shadow:0 8px 24px rgba(34,11,89,0.12); position:sticky; top:0; z-index:40;
    }
    .brand{display:flex;align-items:center;gap:14px}
    .logo{width:48px;height:48px;border-radius:10px;background:rgba(255,255,255,0.12);
      display:flex;align-items:center;justify-content:center;font-weight:700; font-size:16px;}
    .top-right{display:flex;align-items:center;gap:12px}
    .profile-mini{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.12);padding:6px 10px;border-radius:999px;cursor:pointer;position:relative;}
    .profile-mini .avatar{width:36px;height:36px;border-radius:50%;background:var(--c4);color:var(--c3);display:flex;align-items:center;justify-content:center;font-weight:700}
    .profile-mini .meta{font-size:13px;color:#fff}
    .profile-mini .meta small{display:block;font-size:11px;color:rgba(255,255,255,0.85);opacity:0.9}

    .profile-dropdown {
      position: absolute;
      right: 0px;
      top: 65px;
      background: var(--c3);
      width: 160px;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      overflow: hidden;
      z-index: 500;
      display: none;
    }
    .profile-dropdown.show {
      display: block;
    }
    .profile-dropdown a {
      display: block;
      padding: 12px;
      color: #fff;
      font-size: 14px;
      text-decoration: none;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
    }
    .profile-dropdown a:hover {
      background: rgba(255,255,255,0.1);
    }
    .profile-dropdown a:last-child {
      border-bottom: none;
    }

    /* Notification */
    .notification-bell-container {
      position: relative;
      display: inline-block;
      cursor: pointer;
      font-size: 28px;
      color: white;
    }

    .notification-badge {
      position:absolute;
      top:-5px;
      right:-5px;
      background:red;
      color:white;
      padding:2px 6px;
      border-radius:50%;
      font-size:12px;
      font-weight:bold;
      display:none;
    }
    .notification-badge.show {
      display: block;
    }

    #notificationPanel {
      display:none;
      position:absolute;
      top:60px;
      right:170px;
      width:260px;
      background:#262C53;
      border-radius:10px;
      padding:10px;
      box-shadow:0 6px 20px rgba(0,0,0,0.3);
      z-index:999;
    }
    #notificationPanel.show {
      display: block;
    }
    .notification-item {
      background:#1a2349;
      padding:10px;
      border-radius:8px;
      margin-bottom:8px;
      font-size:14px;
    }
    
    /* Layout */
    .container{display:flex;gap:20px;padding:28px;max-width:1200px;margin:22px auto;}
    aside.sidebar{
      width:220px;border-radius:var(--radius);padding:18px;color:var(--text-dark);
      background:var(--c3);
      box-shadow:0 6px 18px rgba(0,0,0,0.06); flex-shrink:0;
    }
    .sidebar h2{font-size:14px;margin:0 0 12px 0; color:var(--c4);}
    .nav-item{display:block;padding:12px;border-radius:10px;margin-bottom:8px;color:var(--muted);cursor:pointer;text-decoration:none}
    .nav-item.active{background:var(--c4);color:var(--c3);font-weight:600}
    .nav-item:hover{background:rgba(255,255,255,0.06);color:var(--c4)}

    /* Main */
    main.main{flex:1}
    
    .dashboard-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 24px;
      background: var(--soft);
      border-radius: var(--radius);
      box-shadow: 0 8px 32px rgba(15,12,36,0.12);
      border: 1px solid rgba(255,255,255,0.05);
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .dashboard-title {
      margin: 0;
      color: var(--c4);
    }
    
    .risk-overview {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: var(--card);
      border-radius: var(--radius);
    }
    
    .risk-circle {
      position: relative;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: conic-gradient(
        var(--risk-high) 0% 65%,
        var(--risk-medium) 65% 85%,
        var(--risk-low) 85% 100%
      );
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
    
    .risk-circle-inner {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      background: var(--soft);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    
    .risk-percentage {
      font-size: 36px;
      line-height: 1;
    }
    
    .risk-label {
      font-size: 14px;
      color: var(--muted);
      margin-top: 4px;
    }
    
    .risk-status {
      font-size: 18px;
      font-weight: 600;
      margin-top: 8px;
    }
    
    .risk-indicators {
      display: flex;
      gap: 24px;
      margin-top: 12px;
    }
    
    .risk-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
    }
    
    .risk-indicator-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    
    .risk-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    
    .risk-card {
      background: var(--card);
      border-radius: var(--radius);
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      height: 140px;
      border: 1px solid rgba(255,255,255,0.05);
    }
    
    .risk-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
      border-color: rgba(162, 244, 249, 0.3);
    }
    
    .risk-card-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }
    
    .risk-card-value {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .risk-card-label {
      font-size: 14px;
      color: var(--muted);
    }
    
    .dashboard-section {
      background: var(--card);
      border-radius: var(--radius);
      padding: 20px;
      border: 1px solid rgba(255,255,255,0.05);
    }
    
    .dashboard-section h3 {
      margin-top: 0;
      margin-bottom: 16px;
      color: var(--c4);
    }
    
    .progress-bar {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      margin-top: 8px;
    }
    
    .progress-fill {
      height: 100%;
      border-radius: 4px;
    }

    .btn{padding:8px 12px;border-radius:8px;border:none;cursor:pointer}
    .btn.primary{background:var(--c4);color:var(--c3);font-weight:600}
    .btn.ghost{background:var(--soft);border:1px solid rgba(255,255,255,0.1);color:var(--text-dark);}

    table{width:100%;border-collapse:collapse}
    th,td{padding:10px;border-bottom:1px solid rgba(255,255,255,0.1);text-align:left;font-size:14px}
    th{color:var(--c4);}

    @media (max-width:980px){
      .container{padding:12px;flex-direction:column}
      aside.sidebar{width:100%;display:flex;overflow:auto}
      .risk-cards {
        grid-template-columns: 1fr;
      }
      .dashboard-content {
        padding: 16px;
      }
    }
    @media (max-width:640px){
      .risk-circle {
        width: 160px;
        height: 160px;
      }
      .risk-circle-inner {
        width: 120px;
        height: 120px;
      }
      .risk-percentage {
        font-size: 28px;
      }
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{styles}</style>

      {/* TOPBAR */}
      <div className="topbar">
        <div className="brand">
          <div style={{fontSize:'14px',opacity:0.95}}>DropShield</div>
        </div>

        <div className="top-right">
          {/* Notification Bell */}
          <div className="notification-bell-container" onClick={toggleNotificationPanel}>
            <i className="fas fa-bell" style={{fontSize:'28px', color:'white'}}></i>
            {unreadNotifications > 0 && (
              <span className={`notification-badge ${notificationPanelVisible ? 'show' : ''}`}>
                {unreadNotifications}
              </span>
            )}
          </div>

          {/* Notification Panel */}
          {notificationPanelVisible && (
            <div id="notificationPanel" className={`${notificationPanelVisible ? 'show' : ''}`}>
              <h4 style={{margin:'0 0 10px', color:'var(--c4)'}}>Notifications</h4>
              <div id="notifList">
                {mentorNotifications.map((notif, idx) => (
                  <div key={idx} className="notification-item">{notif}</div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Mini */}
          <div className="profile-mini" onClick={toggleProfileDropdown}>
            <div className="avatar">{student?.name?.charAt(0).toUpperCase() || 'S'}</div>
            <div className="meta">{student?.name || 'Student'}<small>{student?.deptId?.name || 'Loading...'}</small></div>
            
            {/* Profile Dropdown */}
            {profileDropdownVisible && (
              <div className={`profile-dropdown ${profileDropdownVisible ? 'show' : ''}`}>
                <button onClick={() => navigate('/StudentProfile')} style={{background: 'none', border: 'none', color: '#fff', fontSize: '14px', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'block', padding: '12px', width: '100%', textAlign: 'left'}}>Profile</button>
                <button onClick={() => navigate('/')} style={{background: 'none', border: 'none', color: '#fff', fontSize: '14px', textDecoration: 'none', cursor: 'pointer', display: 'block', padding: '12px', width: '100%', textAlign: 'left'}}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* MAIN */}
      <div className="container">
        {/* SIDEBAR */}
        <aside className="sidebar" id="sidebar">
          <h2>Welcome</h2>
          <button className={`nav-item ${activePage === 'dashboardPage' ? 'active' : ''}`} onClick={() => navigateToPage('dashboardPage')} style={{background: 'none', border: 'none', padding: '12px', borderRadius: '10px', marginBottom: '8px', color: 'var(--muted)', cursor: 'pointer', textDecoration: 'none', textAlign: 'left', width: '100%'}}>Dashboard</button>
          <button className={`nav-item ${activePage === 'marksPage' ? 'active' : ''}`} onClick={() => navigateToPage('marksPage')} style={{background: 'none', border: 'none', padding: '12px', borderRadius: '10px', marginBottom: '8px', color: 'var(--muted)', cursor: 'pointer', textDecoration: 'none', textAlign: 'left', width: '100%'}}>Marks</button>
          <button className={`nav-item ${activePage === 'attendancePage' ? 'active' : ''}`} onClick={() => navigateToPage('attendancePage')} style={{background: 'none', border: 'none', padding: '12px', borderRadius: '10px', marginBottom: '8px', color: 'var(--muted)', cursor: 'pointer', textDecoration: 'none', textAlign: 'left', width: '100%'}}>Attendance</button>
          <button className={`nav-item ${activePage === 'feesPage' ? 'active' : ''}`} onClick={() => navigateToPage('feesPage')} style={{background: 'none', border: 'none', padding: '12px', borderRadius: '10px', marginBottom: '8px', color: 'var(--muted)', cursor: 'pointer', textDecoration: 'none', textAlign: 'left', width: '100%'}}>Fees</button>
          <button className={`nav-item ${activePage === 'calendarPage' ? 'active' : ''}`} onClick={() => navigateToPage('calendarPage')} style={{background: 'none', border: 'none', padding: '12px', borderRadius: '10px', marginBottom: '8px', color: 'var(--muted)', cursor: 'pointer', textDecoration: 'none', textAlign: 'left', width: '100%'}}>Calendar</button>      
          <button className={`nav-item ${activePage === 'counsellingPage' ? 'active' : ''}`} onClick={() => navigate('/counseling')} style={{background: 'none', border: 'none', padding: '12px', borderRadius: '10px', marginBottom: '8px', color: 'var(--muted)', cursor: 'pointer', textDecoration: 'none', textAlign: 'left', width: '100%'}}>Counselling & Risk</button>
        </aside>
        
        {/* DASHBOARD PAGE */}
        {activePage === 'dashboardPage' && (
          <main className="main" id="dashboardPage">
            {loading && <div style={{color:'var(--text-dark)', padding:'20px'}}>Loading student data...</div>}
            {error && <div style={{color:'#FF6B6B', padding:'20px', background:'rgba(255,107,107,0.1)', borderRadius:'10px', marginBottom:'20px'}}>{error}</div>}
            {!loading && (
            <div className="dashboard-content">
              <div className="dashboard-header">
                <h2 className="dashboard-title">Academic Risk Dashboard</h2>
                <button className="btn ghost">View Detailed Report</button>
              </div>
              
              <div className="risk-overview">
                <div className="risk-circle">
                  <div className="risk-circle-inner">
                    <div className="risk-percentage">{exams?.gpa || '0'}%</div>
                    <div className="risk-label">GPA</div>
                  </div>
                </div>
                <div className="risk-status">Academic Progress</div>
                <div className="risk-indicators">
                  <div className="risk-indicator">
                    <div className="risk-indicator-color" style={{background:'var(--risk-high)'}}></div>
                    <span>Roll: {student?.roll}</span>
                  </div>
                  <div className="risk-indicator">
                    <div className="risk-indicator-color" style={{background:'var(--risk-medium)'}}></div>
                    <span>Exams: {exams?.count || 0}</span>
                  </div>
                  <div className="risk-indicator">
                    <div className="risk-indicator-color" style={{background:'var(--risk-low)'}}></div>
                    <span>Dept: {student?.deptId?.name || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="risk-cards">
                <div className="risk-card" onClick={() => navigateToPage('marksPage')}>
                  <div className="risk-card-icon">📚</div>
                  <div className="risk-card-value">{exams?.gpa || '0'}</div>
                  <div className="risk-card-label">Current GPA</div>
                </div>
                <div className="risk-card" onClick={() => navigateToPage('attendancePage')}>
                  <div className="risk-card-icon">✓</div>
                  <div className="risk-card-value">{attendance?.percentage || '0'}%</div>
                  <div className="risk-card-label">Attendance</div>
                </div>
                <div className="risk-card" onClick={() => navigateToPage('feesPage')}>
                  <div className="risk-card-icon">💰</div>
                  <div className="risk-card-value">₹{fees?.pending || '0'}</div>
                  <div className="risk-card-label">Fees Pending</div>
                </div>
              </div>
              
              <div className="dashboard-section">
                <h3>Student Information</h3>
                <table>
                  <tbody>
                    <tr>
                      <td style={{fontWeight:'600'}}>Name</td>
                      <td>{student?.name}</td>
                    </tr>
                    <tr>
                      <td style={{fontWeight:'600'}}>Roll</td>
                      <td>{student?.roll}</td>
                    </tr>
                    <tr>
                      <td style={{fontWeight:'600'}}>Email</td>
                      <td>{student?.email}</td>
                    </tr>
                    <tr>
                      <td style={{fontWeight:'600'}}>Phone</td>
                      <td>{student?.phone || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={{fontWeight:'600'}}>Department</td>
                      <td>{student?.deptId?.name || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={{fontWeight:'600'}}>DOB</td>
                      <td>{student?.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </main>
        )}

        {/* MARKS PAGE */}
        {activePage === 'marksPage' && (
          <main className="main" id="marksPage">
            {loading ? (
              <div style={{color:'var(--text-dark)', padding:'20px'}}>Loading...</div>
            ) : (
            <div className="dashboard-content">
              <div className="dashboard-header">
                <h2 className="dashboard-title">Your Marks</h2>
              </div>
              <div className="dashboard-section">
                {exams?.exams?.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Exam</th>
                        <th>Marks</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exams.exams.map((e, i) => {
                        const grade = e.marks >= 80 ? 'A+' : e.marks >= 70 ? 'A' : e.marks >= 60 ? 'B' : 'C';
                        return (
                          <tr key={i}>
                            <td>{e.subject}</td>
                            <td>{e.examName}</td>
                            <td>{e.marks}</td>
                            <td style={{color:'var(--c4)', fontWeight:'600'}}>{grade}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p style={{color:'var(--muted)'}}>No exams recorded yet.</p>
                )}
              </div>
            </div>
            )}
          </main>
        )}

        {/* ATTENDANCE PAGE */}
        {activePage === 'attendancePage' && (
          <main className="main" id="attendancePage">
            {loading ? (
              <div style={{color:'var(--text-dark)', padding:'20px'}}>Loading...</div>
            ) : (
            <div className="dashboard-content">
              <div className="dashboard-header">
                <h2 className="dashboard-title">Attendance</h2>
              </div>
              <div className="dashboard-section">
                <p>Current Attendance: <strong style={{color:'var(--c4)', fontSize:'18px'}}>{attendance?.percentage || '0'}%</strong></p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width:`${attendance?.percentage || 0}%`, background:'var(--c4)'}}></div>
                </div>
                <p style={{color:'var(--muted)', marginTop:'10px'}}>Present: {attendance?.present}/{attendance?.total} days</p>
              </div>
            </div>
            )}
          </main>
        )}

        {/* FEES PAGE */}
        {activePage === 'feesPage' && (
          <main className="main" id="feesPage">
            {loading ? (
              <div style={{color:'var(--text-dark)', padding:'20px'}}>Loading...</div>
            ) : (
            <div className="dashboard-content">
              <div className="dashboard-header">
                <h2 className="dashboard-title">Fees Status</h2>
              </div>
              <div className="dashboard-section">
                <div style={{marginBottom:'15px'}}>
                  <p style={{color:'var(--muted)'}}>Total Fees: <strong style={{color:'var(--text-dark)'}}>₹{fees?.total || '0'}</strong></p>
                  <p style={{color:'var(--muted)'}}>Paid: <strong style={{color:'var(--c4)'}}>₹{fees?.paid || '0'}</strong></p>
                  <p style={{color:'var(--muted)'}}>Pending: <strong style={{color: fees?.pending > 0 ? '#FF6B6B' : 'var(--c4)' }}>₹{fees?.pending || '0'}</strong></p>
                </div>
                {fees?.pending && fees.pending > 0 ? (
                  <p style={{color:'#FF6B6B', background:'rgba(255,107,107,0.1)', padding:'10px', borderRadius:'6px'}}>⚠ Payment pending. Please pay before deadline.</p>
                ) : (
                  <p style={{color:'var(--c4)', background:'rgba(162,244,249,0.1)', padding:'10px', borderRadius:'6px'}}>✓ All fees paid up. No pending dues.</p>
                )}
              </div>
            </div>
            )}
          </main>
        )}

        {/* CALENDAR PAGE */}
        {activePage === 'calendarPage' && (
          <main className="main" id="calendarPage">
            <div className="dashboard-content">
              <div className="dashboard-header">
                <h2 className="dashboard-title">Academic Calendar</h2>
              </div>
              <div className="dashboard-section">
                <p>Calendar will be displayed here.</p>
              </div>
            </div>
          </main>
        )}

        {/* COUNSELLING PAGE */}
        {activePage === 'counsellingPage' && (
          <main className="main" id="counsellingPage">
            <div className="dashboard-content">
              <div className="dashboard-header">
                <h2 className="dashboard-title">Counselling & Support</h2>
              </div>
              <div className="dashboard-section">
                <p>Connect with mentors and counselors for support.</p>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

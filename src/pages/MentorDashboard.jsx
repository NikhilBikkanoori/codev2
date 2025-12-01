import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mentorFetchProfile, mentorFetchAssignedStudents, mentorFetchStats, mentorFetchStudentDetails } from '../utils/api';

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [mentor, setMentor] = useState(null);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadMentorData = async () => {
      try {
        setLoading(true);
        setError('');
        const [profRes, studRes, statRes] = await Promise.all([
          mentorFetchProfile(),
          mentorFetchAssignedStudents(),
          mentorFetchStats()
        ]);
        setMentor(profRes.data);
        setStudents(studRes.data.students || []);
        setStats(statRes.data);
      } catch (e) {
        console.error('Load mentor data error:', e);
        setError(e.response?.data?.msg || 'Failed to load mentor data');
      } finally {
        setLoading(false);
      }
    };
    loadMentorData();
  }, []);

  const handleSelectStudent = async (s) => {
    setSelectedStudent(s);
    try {
      const res = await mentorFetchStudentDetails(s.roll);
      setStudentDetails(res.data);
    } catch (e) {
      console.error('Load student details error:', e);
      setError(e.response?.data?.msg || 'Failed to load student details');
    }
  };

  const filteredStudents = students.filter(s =>
    (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.roll || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      --info: #339af0;
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
      gap: 0;
      margin-top: 60px;
      width: 100%;
    }

    .sidebar {
      width: 200px;
      background: var(--card);
      padding: 20px;
      min-height: calc(100vh - 60px);
      box-shadow: 2px 0 8px rgba(0,0,0,0.1);
    }

    .sidebar h2 {
      font-size: 14px;
      margin: 0 0 12px 0;
      color: var(--accent);
    }

    .nav-item {
      display: block;
      padding: 12px;
      margin: 4px 0;
      background: transparent;
      border: none;
      color: var(--text);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
      text-align: left;
      font-size: 14px;
    }

    .nav-item:hover {
      background: rgba(255,255,255,0.06);
      color: var(--accent);
    }

    .nav-item.active {
      background: var(--accent);
      color: var(--card);
      font-weight: 600;
    }

    .main {
      flex: 1;
      padding: 28px;
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
      right: 28px;
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
  `;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{styles}</style>

      {/* TOPBAR */}
      <div className="topbar">
        <div className="brand">
          <div className="logo">DS</div>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.95 }}>Mentor Dashboard</div>
            <div style={{ fontSize: '12px', opacity: 0.85 }}>DropShield</div>
          </div>
        </div>

        <div className="top-right">
          <div className="profile-mini" onClick={() => setProfileDropdownVisible(!profileDropdownVisible)}>
            <div className="avatar">{mentor?.name?.charAt(0).toUpperCase() || 'M'}</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{mentor?.name || 'Mentor'}</div>
              <small style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.85)' }}>{mentor?.fid || 'Loading...'}</small>
            </div>
          </div>
          {/* Profile Dropdown */}
            {profileDropdownVisible && (
              <div className={`profile-dropdown ${profileDropdownVisible ? 'show' : ''}`}>
                <button onClick={() => navigate('/MentorProfile')} style={{background: 'none', border: 'none', color: '#fff', fontSize: '14px', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'block', padding: '12px', width: '100%', textAlign: 'left'}}>Profile</button>
                <button onClick={() => navigate('/')} style={{background: 'none', border: 'none', color: '#fff', fontSize: '14px', textDecoration: 'none', cursor: 'pointer', display: 'block', padding: '12px', width: '100%', textAlign: 'left'}}>Logout</button>
              </div>
            )}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="container">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <h2>Overview</h2>
          {stats && (
            <>
              <div className="stat-mini">
                <div style={{fontSize: '12px', opacity: 0.7}}>Total Students</div>
                <div style={{fontSize: '18px', fontWeight: '700', color: 'var(--accent)'}}>{stats.studentCount}</div>
              </div>
              <div className="stat-mini">
                <div style={{fontSize: '12px', opacity: 0.7}}>Avg Attendance</div>
                <div style={{fontSize: '18px', fontWeight: '700', color: 'var(--accent)'}}>{stats.avgAttendance}%</div>
              </div>
              <div className="stat-mini">
                <div style={{fontSize: '12px', opacity: 0.7}}>Avg GPA</div>
                <div style={{fontSize: '18px', fontWeight: '700', color: 'var(--accent)'}}>{stats.avgGPA}</div>
              </div>
            </>
          )}
          <h3 style={{marginTop: '20px', fontSize: '14px', opacity: 0.8}}>Quick Links</h3>
          <button className={`nav-item ${activeNav === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveNav('dashboard')}>
            Dashboard
          </button>
          <button className={`nav-item ${activeNav === 'mentees' ? 'active' : ''}`} onClick={() => setActiveNav('mentees')}>
            Mentees
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main">
          {error && <div style={{background: 'rgba(255,107,107,0.1)', color: '#FF6B6B', padding: '12px', borderRadius: '8px', marginBottom: '15px'}}>⚠ {error}</div>}
          
          {activeNav === 'dashboard' && (
            <>
              <h2>Dashboard Overview</h2>
              {loading ? (
                <p style={{color: 'var(--muted)'}}>Loading...</p>
              ) : (
              <>
                <p style={{ color: 'var(--muted)' }}>Monitor your mentees' performance and attendance.</p>
                
                <div className="grid">
                  <div className="stat-box">
                    <div className="stat-label">Total Mentees</div>
                    <div className="stat-value">{stats?.studentCount || 0}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Avg Attendance</div>
                    <div className="stat-value">{stats?.avgAttendance || 0}%</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Avg GPA</div>
                    <div className="stat-value">{stats?.avgGPA || 0}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Department</div>
                    <div className="stat-value" style={{fontSize: '14px'}}>{mentor?.deptId?.name || 'N/A'}</div>
                  </div>
                </div>
              </>
              )}
            </>
          )}

          {activeNav === 'mentees' && (
            <>
              <h2>Your Mentees</h2>
              {loading ? (
                <p style={{color: 'var(--muted)'}}>Loading mentees...</p>
              ) : (
              <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px'}}>
                <div className="card" style={{maxHeight: '500px', overflowY: 'auto'}}>
                  <h3 style={{marginTop: 0, fontSize: '14px', color: 'var(--accent)'}}>Students ({filteredStudents.length})</h3>
                  <input
                    type="text"
                    placeholder="Search name or roll..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{width: '100%', padding: '8px', background: 'var(--soft)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-light)', marginBottom: '10px'}}
                  />
                  {filteredStudents.map((s) => (
                    <div
                      key={s._id}
                      onClick={() => handleSelectStudent(s)}
                      style={{
                        padding: '10px',
                        background: selectedStudent?._id === s._id ? 'rgba(162,244,249,0.2)' : 'var(--soft)',
                        borderLeft: selectedStudent?._id === s._id ? '3px solid var(--accent)' : '3px solid transparent',
                        cursor: 'pointer',
                        marginBottom: '8px',
                        borderRadius: '6px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{fontWeight: '600', fontSize: '14px'}}>{s.name}</div>
                      <div style={{fontSize: '12px', opacity: 0.7}}>{s.roll}</div>
                    </div>
                  ))}
                </div>
                
                {selectedStudent && studentDetails ? (
                  <div className="card">
                    <h3 style={{marginTop: 0, color: 'var(--accent)'}}>Details: {selectedStudent.name}</h3>
                    
                    <div style={{background: 'var(--soft)', padding: '12px', borderRadius: '6px', marginBottom: '12px'}}>
                      <h4 style={{margin: '0 0 8px 0', fontSize: '13px', opacity: 0.9}}>Personal</h4>
                      <div style={{fontSize: '13px', display: 'grid', gap: '6px'}}>
                        <div><strong>Roll:</strong> {selectedStudent.roll}</div>
                        <div><strong>Email:</strong> {selectedStudent.email || 'N/A'}</div>
                        <div><strong>Phone:</strong> {selectedStudent.phone || 'N/A'}</div>
                      </div>
                    </div>

                    <div style={{background: 'var(--soft)', padding: '12px', borderRadius: '6px', marginBottom: '12px'}}>
                      <h4 style={{margin: '0 0 8px 0', fontSize: '13px', opacity: 0.9}}>Attendance</h4>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                        <span>{studentDetails.metrics.attendance.percentage}%</span>
                        <span style={{fontSize: '12px', opacity: 0.7}}>{studentDetails.metrics.attendance.present}/{studentDetails.metrics.attendance.total}</span>
                      </div>
                      <div style={{width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden'}}>
                        <div style={{height: '100%', width: `${studentDetails.metrics.attendance.percentage}%`, background: 'var(--accent)', transition: 'width 0.3s'}}></div>
                      </div>
                    </div>

                    <div style={{background: 'var(--soft)', padding: '12px', borderRadius: '6px', marginBottom: '12px'}}>
                      <h4 style={{margin: '0 0 8px 0', fontSize: '13px', opacity: 0.9}}>Academics</h4>
                      <div style={{fontSize: '13px', display: 'grid', gap: '6px'}}>
                        <div><strong>Exams:</strong> {studentDetails.metrics.exams.count}</div>
                        <div><strong>GPA:</strong> <span style={{color: 'var(--accent)', fontWeight: '600'}}>{studentDetails.metrics.exams.gpa}</span></div>
                      </div>
                    </div>

                    <div style={{background: 'var(--soft)', padding: '12px', borderRadius: '6px'}}>
                      <h4 style={{margin: '0 0 8px 0', fontSize: '13px', opacity: 0.9}}>Fees</h4>
                      <div style={{fontSize: '13px', display: 'grid', gap: '6px'}}>
                        <div><strong>Total:</strong> ₹{studentDetails.metrics.fees.total}</div>
                        <div><strong>Paid:</strong> ₹{studentDetails.metrics.fees.paid}</div>
                        <div><strong>Pending:</strong> <span style={{color: studentDetails.metrics.fees.pending > 0 ? 'var(--danger)' : 'var(--accent)'}}>₹{studentDetails.metrics.fees.pending}</span></div>
                      </div>
                    </div>
                  </div>
                  ) : (
                  <div className="card" style={{textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <p style={{color: 'var(--muted)'}}>Select a student to view details</p>
                  </div>
                )}
              </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default MentorDashboard;

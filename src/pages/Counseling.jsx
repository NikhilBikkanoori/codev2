import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Counseling = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboardPage');
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [actions, setActions] = useState([
    { id: '1', title: 'Complete Math integrals assignment', category: 'Assignment', priority: 'High', due: '2024-12-28', status: 'pending' },
    { id: '2', title: 'Attend extra Math class', category: 'Attendance', priority: 'High', due: '2024-12-27', status: 'pending' },
    { id: '3', title: 'Review Weak Areas (Math & Physics)', category: 'Goal', priority: 'High', due: '2024-12-30', status: 'pending' }
  ]);
  const [goals, setGoals] = useState([]);
  const [uploadedResources, setUploadedResources] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('prio');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Assignment');
  const [newTaskPriority, setNewTaskPriority] = useState('High');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [googleSearch, setGoogleSearch] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  const studentData = {
    name: 'Alice Kumar',
    dept: 'CSE',
    year: '2nd Yr',
    id: '21CSE045',
    mentors: [
      { id: 1, name: 'Dr. Rajesh Kumar', subject: 'Mathematics', message: 'Your algebra score is improving! Keep practicing.', avatar: 'RK' },
      { id: 2, name: 'Prof. Priya Singh', subject: 'Physics', message: 'Attend the extra classes for better understanding.', avatar: 'PS' },
      { id: 3, name: 'Ms. Anjali Verma', subject: 'English', message: 'Great improvement in writing skills!', avatar: 'AV' }
    ],
    subjects: [
      { name: 'Mathematics', score: 42, target: 70, weakTopics: ['Integrals', 'Calculus'] },
      { name: 'Data Structures', score: 65, target: 75, weakTopics: ['Trees', 'Graphs'] },
      { name: 'Operating Systems', score: 58, target: 70, weakTopics: ['Process Sync', 'Memory Management'] }
    ]
  };

  const getDueLabel = (due) => {
    if (!due) return '';
    const today = new Date();
    const dd = new Date(due);
    const diff = Math.ceil((dd - today) / (1000 * 60 * 60 * 24));
    if (diff > 1) return `${diff} days`;
    if (diff === 1) return 'Tomorrow';
    if (diff === 0) return 'Today';
    return 'Overdue';
  };

  const getPriorityDot = (priority) => {
    if (priority === 'High') return 'prio-high';
    if (priority === 'Medium') return 'prio-med';
    return 'prio-low';
  };

  const getPriorityPill = (priority) => {
    if (priority === 'High') return 'pill high';
    if (priority === 'Medium') return 'pill med';
    return 'pill low';
  };

  const getBadgeClass = (category) => {
    const map = {
      'Assignment': 'badge-assignment',
      'Attendance': 'badge-attendance',
      'Exam': 'badge-exam',
      'Project': 'badge-project',
      'Wellness': 'badge-wellness',
      'Goal': 'badge-goal',
      'Personal': 'badge-personal'
    };
    return map[category] || 'badge-personal';
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      alert('Please enter a task title');
      return;
    }
    setActions([...actions, {
      id: Date.now().toString(),
      title: newTaskTitle,
      category: newTaskCategory,
      priority: newTaskPriority,
      due: newTaskDue,
      status: 'pending'
    }]);
    setNewTaskTitle('');
    setNewTaskDue('');
  };

  const handleMarkDone = (id) => {
    setActions(actions.map(a => a.id === id ? { ...a, status: 'done' } : a));
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Delete this task?')) {
      setActions(actions.filter(a => a.id !== id));
    }
  };

  const handleAddGoal = () => {
    if (!newGoalTitle || !newGoalDeadline || !newGoalTarget) {
      alert('Please fill all fields');
      return;
    }
    setGoals([...goals, {
      id: Date.now().toString(),
      title: newGoalTitle,
      deadline: newGoalDeadline,
      target: parseInt(newGoalTarget),
      current: 0
    }]);
    setNewGoalTitle('');
    setNewGoalDeadline('');
    setNewGoalTarget('');
  };

  const handleGoogleSearch = () => {
    if (googleSearch.trim()) {
      window.open('https://www.google.com/search?q=' + encodeURIComponent(googleSearch), '_blank');
      setSearchHistory([googleSearch, ...searchHistory]);
      setGoogleSearch('');
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      setUploadedResources([...uploadedResources, {
        id: Date.now().toString(),
        name: file.name
      }]);
    });
  };

  const filteredActions = () => {
    let result = actions.slice();
    if (filterCategory !== 'all') result = result.filter(a => a.category === filterCategory);
    if (sortBy === 'prio') {
      const order = { High: 0, Medium: 1, Low: 2 };
      result.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sortBy === 'due') {
      result.sort((a, b) => (a.due || '9999-12-31').localeCompare(b.due || '9999-12-31'));
    }
    return result;
  };

  const progressPercent = actions.length > 0 ? Math.round((actions.filter(a => a.status === 'done').length / actions.length) * 100) : 0;

  const clearCompleted = () => {
    if (window.confirm('Clear all completed actions?')) {
      setActions(actions.filter(a => a.status !== 'done'));
    }
  };

  return (
    <div style={{ background: '#192047', minHeight: '100vh', color: '#F7FAFC', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        :root { --c1: #192047; --c2: #FFD1D8; --c3: #262C53; --c4: #A2F4F9; --text-dark: #F7FAFC; --muted: #7b7b8a; --soft: #1a2349; --success: #16a34a; --warning: #f59e0b; --danger: #ff6b6b; --info: #3b82f6; }
        * { box-sizing: border-box; margin: 0; }
        .topbar { background: #262C53; color: #fff; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 8px 24px rgba(34,11,89,0.12); position: sticky; top: 0; z-index: 40; }
        .brand { display: flex; align-items: center; gap: 12px; }
        .logo { width: 44px; height: 44px; border-radius: 10px; background: rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; }
        .top-right { display: flex; align-items: center; gap: 20px; position: relative; }
        .muted { color: #7b7b8a; }
        .profile-mini { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.12); padding: 6px 10px; border-radius: 999px; cursor: pointer; position: relative; }
        .profile-mini .avatar { width: 34px; height: 34px; border-radius: 50%; background: #A2F4F9; color: #262C53; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .profile-dropdown { position: absolute; top: 45px; right: 0; background: #262C53; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 8px 0; min-width: 150px; z-index: 100; display: none; }
        .profile-dropdown.show { display: block; }
        .profile-dropdown button { display: block; width: 100%; padding: 10px 16px; border: none; background: transparent; color: #F7FAFC; cursor: pointer; text-align: left; font-size: 14px; font-family: inherit; }
        .profile-dropdown button:hover { background: rgba(255,255,255,0.1); }
        .container { display: flex; gap: 18px; padding: 20px; max-width: 1400px; margin: 20px auto; }
        aside.sidebar { width: 240px; border-radius: 14px; padding: 16px; background: #262C53; flex-shrink: 0; height: fit-content; max-height: calc(100vh - 100px); overflow-y: auto; }
        .sidebar h2 { font-size: 14px; margin: 0 0 12px 0; color: #A2F4F9; }
        .nav-item { display: block; padding: 10px; border-radius: 10px; margin-bottom: 8px; color: #7b7b8a; cursor: pointer; border: none; width: 100%; text-align: left; font-family: inherit; background: transparent; transition: all 0.2s; }
        .nav-item.active { background: #A2F4F9; color: #262C53; font-weight: 600; }
        .nav-item:hover { background: rgba(255,255,255,0.06); color: #A2F4F9; }
        main.main { flex: 1; overflow-y: auto; max-height: calc(100vh - 100px); }
        .grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 18px; }
        .card { background: #262C53; padding: 16px; border-radius: 12px; box-shadow: 0 6px 20px rgba(15,12,36,0.06); }
        .stat-card { background: #1a2349; padding: 16px; border-radius: 10px; text-align: center; }
        .stat-number { font-size: 24px; font-weight: 700; margin: 8px 0; color: #A2F4F9; }
        .stat-label { font-size: 12px; color: #7b7b8a; }
        .progress-bar { height: 8px; background: #1a2349; border-radius: 10px; overflow: hidden; margin: 8px 0; }
        .progress-fill { height: 100%; background: #A2F4F9; transition: width 0.3s; }
        .btn { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; transition: all 0.2s; font-family: inherit; font-size: 14px; }
        .btn.primary { background: #A2F4F9; color: #262C53; }
        .btn.secondary { background: #3b82f6; color: white; }
        .btn.success { background: #16a34a; color: white; }
        .btn.ghost { background: #1a2349; border: 1px solid rgba(255,255,255,0.1); color: #F7FAFC; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .task { display: flex; justify-content: space-between; gap: 12px; padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.02); align-items: center; margin-bottom: 8px; background: linear-gradient(180deg, rgba(255,255,255,0.01), transparent); }
        .task-left { display: flex; gap: 12px; align-items: center; flex: 1; min-width: 0; }
        .task-body { min-width: 0; flex: 1; }
        .task-body h4 { margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 14px; font-weight: 600; }
        .task-meta { font-size: 12px; color: #7b7b8a; margin-top: 4px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .prio-high { background: linear-gradient(90deg, #ff6b6b, #ff8b8b); }
        .prio-med { background: linear-gradient(90deg, #f59e0b, #ffc786); }
        .prio-low { background: linear-gradient(90deg, #16a34a, #9ef0b5); }
        .pill { padding: 6px 8px; border-radius: 999px; font-size: 13px; display: inline-block; white-space: nowrap; margin-right: 4px; }
        .pill.high { background: rgba(246,85,85,0.08); color: #ff6b6b; }
        .pill.med { background: rgba(255,159,67,0.08); color: #f59e0b; }
        .pill.low { background: rgba(40,199,111,0.08); color: #16a34a; }
        .badge { padding: 4px 8px; border-radius: 6px; font-size: 12px; display: inline-block; margin-right: 8px; }
        .badge-assignment { background: rgba(96,211,255,0.08); color: #A2F4F9; }
        .badge-goal { background: rgba(120,210,160,0.08); color: #34b28a; }
        input, select, textarea { background: #1a2349; border: 1px solid rgba(255,255,255,0.04); padding: 8px; border-radius: 8px; color: #F7FAFC; font-family: inherit; width: 100%; margin-bottom: 8px; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #A2F4F9; }
        .mentor-card { background: #1a2349; padding: 12px; border-radius: 8px; margin-bottom: 12px; border-left: 3px solid #A2F4F9; display: flex; gap: 12px; align-items: flex-start; }
        .mentor-avatar { width: 40px; height: 40px; border-radius: 50%; background: #A2F4F9; color: #262C53; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
        .mood-options { display: flex; gap: 8px; margin: 12px 0; }
        .mood-option { flex: 1; padding: 12px; border-radius: 8px; text-align: center; cursor: pointer; background: #1a2349; border: none; color: #F7FAFC; font-family: inherit; transition: all 0.2s; font-size: 24px; }
        .mood-option:hover { transform: scale(1.05); background: #262C53; }
        .mood-option.selected { background: #A2F4F9; color: #262C53; font-weight: 600; }
        .risk-indicator { padding: 8px 16px; border-radius: 20px; font-weight: 700; font-size: 14px; display: inline-block; }
        .risk-medium { background: #f59e0b; color: black; }
        .pyq-card { background: #1a2349; padding: 12px; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s; border: none; color: #F7FAFC; font-family: inherit; }
        .pyq-card:hover { transform: translateY(-2px); background: #262C53; }
        hr { border: none; height: 1px; background: rgba(255,255,255,0.03); margin: 10px 0; }
        h2 { margin: 0 0 12px 0; }
        h3 { margin-top: 0; }
        h4 { margin: 0 0 12px 0; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: 600; font-size: 12px; }
        td { padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 13px; }
        .row { display: flex; gap: 12px; margin-bottom: 12px; }
        .flex-1 { flex: 1; }
        small { font-size: 12px; color: #7b7b8a; }
      `}
      </style>

      {/* Topbar */}
      <div className="topbar">
        <div className="brand">
          <div className="logo">AIT</div>
          <div style={{ fontSize: '14px', opacity: 0.95 }}>ABC Institute of Technology</div>
        </div>
        <div className="top-right">
          <div className="muted">{new Date().toDateString()}</div>
          <div className="profile-mini" onClick={toggleProfileDropdown}>
            <div className="avatar">A</div>
            <div>{studentData.name}<br /><small>{studentData.dept}, {studentData.year}</small></div>
            {profileDropdownVisible && (
              <div className="profile-dropdown show">
                <button>Profile</button>
                <button>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>Support Navigation</h2>
          {[
            { id: 'dashboardPage', label: 'Recovery Dashboard' },
            { id: 'actionsPage', label: 'Suggested Actions' },
            { id: 'academicPage', label: 'Academic Recovery' },
            { id: 'attendancePage', label: 'Attendance Tracker' },
            { id: 'wellnessPage', label: 'Mental Wellness' },
            { id: 'riskPage', label: 'Risk Assessment' },
            { id: 'supportPage', label: 'Support Network' },
            { id: 'goalsPage', label: 'Goal Setting' },
            { id: 'resourcesPage', label: 'Resources' },
            { id: 'uploadPage', label: 'Upload&Search' }
          ].map(item => (
            <button key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`} onClick={() => setActivePage(item.id)}>
              {item.label}
            </button>
          ))}
          <hr />
          <div style={{ padding: '12px', background: '#1a2349', borderRadius: '10px', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#7b7b8a', marginBottom: '8px' }}>Your Recovery Status</div>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>65% recovery progress</div>
            <div className="risk-indicator risk-medium">Medium Risk</div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: '65%' }}></div></div>
          </div>
          <button className="btn primary" style={{ width: '100%', marginTop: '12px' }}>Request Immediate Help</button>
          <button className="nav-item" onClick={() => navigate('/dashboard')} style={{ marginTop: '8px' }}>Back to Dashboard</button>
        </aside>

        {/* Main Content */}
        <main className="main">
          <div className="grid">
            
            {/* Dashboard Page */}
            {activePage === 'dashboardPage' && (
              <section className="card" style={{ gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h2>Welcome to Your Support Center, {studentData.name}</h2>
                    <p style={{ margin: 0, color: '#7b7b8a' }}>We're here to help you get back on track. Let's work on this together.</p>
                  </div>
                  <div className="risk-indicator risk-medium">Medium Risk Level</div>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px' }}>
                  <div className="stat-card">
                    <div className="stat-label">Academic Recovery</div>
                    <div className="stat-number">42%</div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: '42%' }}></div></div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Attendance</div>
                    <div className="stat-number">68%</div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: '68%' }}></div></div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Mental Wellness</div>
                    <div className="stat-number">75%</div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: '75%' }}></div></div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Days in Program</div>
                    <div className="stat-number">14</div>
                    <div className="stat-label">of 30 day plan</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                  <div>
                    <h3>Today's Priority Tasks</h3>
                    {actions.slice(0, 3).map(task => (
                      <div key={task.id} className="task-item" style={{ display: 'flex', gap: '12px', padding: '12px', background: '#1a2349', borderRadius: '8px', marginBottom: '8px', alignItems: 'center' }}>
                        <input type="checkbox" onChange={() => handleMarkDone(task.id)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{task.title}</div>
                          <div style={{ fontSize: '12px', color: '#7b7b8a' }}>{task.category} • Due: {getDueLabel(task.due)}</div>
                        </div>
                      </div>
                    ))}
                    <button className="btn ghost" style={{ width: '100%', marginTop: '12px' }}>View All Tasks</button>
                  </div>

                  <div>
                    <h3>Quick Actions</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button className="btn secondary">📅 Schedule Study</button>
                      <button className="btn success">😊 Log Mood</button>
                      <button className="btn primary">👨‍🏫 Contact Mentor</button>
                      <button className="btn ghost">📊 View Progress</button>
                    </div>

                    <div style={{ marginTop: '20px', padding: '16px', background: '#1a2349', borderRadius: '10px' }}>
                      <h4>Weekly Focus</h4>
                      <p style={{ margin: 0, fontSize: '14px' }}>This week, let's focus on improving your Math scores and maintaining consistent attendance. You're making great progress!</p>
                    </div>
                  </div>
                </div>

                <h3 style={{ marginTop: '24px' }}>Mentor Insights</h3>
                <table>
                  <thead><tr><th>Mentor</th><th>Subject</th><th>Message</th><th>Action</th></tr></thead>
                  <tbody>
                    {studentData.mentors.map(mentor => (
                      <tr key={mentor.id}>
                        <td>{mentor.name}</td>
                        <td>{mentor.subject}</td>
                        <td>{mentor.message}</td>
                        <td><button className="btn ghost" style={{ padding: '4px 8px', fontSize: '12px' }}>Reply</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h3 style={{ marginTop: '24px' }}>Mood Tracker</h3>
                <div className="mood-options">
                  {[{ emoji: '😄', label: 'Great' }, { emoji: '🙂', label: 'Good' }, { emoji: '😐', label: 'Okay' }, { emoji: '😔', label: 'Struggling' }, { emoji: '😢', label: 'Need Help' }].map((mood, idx) => (
                    <button key={idx} className={`mood-option ${selectedMood === idx ? 'selected' : ''}`} onClick={() => setSelectedMood(idx)}>
                      {mood.emoji}<br />{mood.label}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Actions Page */}
            {activePage === 'actionsPage' && (
              <section className="card" style={{ gridColumn: '1 / -1' }}>
                <h3>Suggested Actions — Pro</h3>
                <p style={{ color: '#7b7b8a', marginBottom: '12px' }}>Auto-generated actions + manual tasks. Use filters, set reminders, mark done, or create recurring habits.</p>

                <div style={{ marginBottom: '12px' }}>
                  <div className="row" style={{ marginBottom: '12px' }}>
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ flex: 1 }}>
                      <option value="all">All categories</option>
                      <option value="Assignment">Assignments</option>
                      <option value="Attendance">Attendance</option>
                      <option value="Goal">Goals</option>
                    </select>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ flex: 1, marginLeft: '12px' }}>
                      <option value="prio">Sort by Priority</option>
                      <option value="due">Sort by Due Date</option>
                    </select>
                    <button className="btn ghost" onClick={clearCompleted} style={{ marginLeft: '12px' }}>Clear Done</button>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <input type="text" placeholder="New task title" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
                    <select value={newTaskCategory} onChange={(e) => setNewTaskCategory(e.target.value)}>
                      <option>Assignment</option>
                      <option>Attendance</option>
                      <option>Goal</option>
                    </select>
                    <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <input type="date" value={newTaskDue} onChange={(e) => setNewTaskDue(e.target.value)} />
                    <button className="btn primary" onClick={handleAddTask}>Add Action</button>
                  </div>
                </div>

                {filteredActions().map(task => (
                  <div key={task.id} className="task">
                    <div className="task-left">
                      <div className={`dot ${getPriorityDot(task.priority)}`}></div>
                      <div className="task-body">
                        <h4>{task.title}</h4>
                        <div className="task-meta">
                          <span className={`badge ${getBadgeClass(task.category)}`}>{task.category}</span>
                          <span className={getPriorityPill(task.priority)}>{task.priority}</span>
                          {task.due && <span style={{ marginLeft: '8px' }}>{getDueLabel(task.due)}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className={`btn ${task.status === 'pending' ? 'ghost' : 'success'}`} onClick={() => handleMarkDone(task.id)} style={{ padding: '4px 8px', fontSize: '12px' }}>
                        {task.status === 'pending' ? 'Done' : 'Undo'}
                      </button>
                      <button className="btn ghost" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Academic Recovery Page */}
            {activePage === 'academicPage' && (
              <section className="card" style={{ gridColumn: '1 / -1' }}>
                <h2>Academic Recovery Plan</h2>
                <p style={{ color: '#7b7b8a', marginBottom: '20px' }}>Personalized plan to improve your academic performance</p>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                  <div>
                    <h3>Weak Subjects Analysis</h3>
                    {studentData.subjects.map((subject, idx) => (
                      <div key={idx} style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span>{subject.name}</span>
                          <span>{subject.score}% / {subject.target}%</span>
                        </div>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${(subject.score / subject.target) * 100}%` }}></div></div>
                        <div style={{ fontSize: '12px', color: '#7b7b8a', marginTop: '4px' }}>
                          Weak areas: {subject.weakTopics.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3>Resources</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <button className="btn ghost">📹 Recorded Lectures</button>
                      <button className="btn ghost">📝 Practice Tests</button>
                      <button className="btn ghost">📚 Study Material</button>
                      <button className="btn ghost">👥 Find Study Buddy</button>
                    </div>

                    <div style={{ marginTop: '24px', padding: '16px', background: '#1a2349', borderRadius: '10px' }}>
                      <h4>Peer Tutor Matching</h4>
                      <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>We've found potential study buddies who excel in your weak subjects.</p>
                      <button className="btn primary" style={{ width: '100%' }}>Connect with Peer</button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Attendance Tracker Page */}
            {activePage === 'attendancePage' && (
              <section className="card" style={{ gridColumn: '1 / -1' }}>
                <h2>Attendance Recovery</h2>
                <p style={{ color: '#7b7b8a', marginBottom: '20px' }}>Track and improve your class attendance</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <h3>Current Status</h3>
                    <div style={{ background: '#1a2349', padding: '16px', borderRadius: '10px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Current Attendance</span>
                        <span style={{ fontWeight: 'bold' }}>68%</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: '68%' }}></div></div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0 8px 0' }}>
                        <span>Target Attendance</span>
                        <span style={{ fontWeight: 'bold' }}>75%</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: '75%' }}></div></div>
                    </div>

                    <h3>Attendance Goals</h3>
                    <div style={{ background: '#1a2349', padding: '16px', borderRadius: '10px', marginBottom: '12px' }}>
                      <div style={{ fontWeight: '600', marginBottom: '8px' }}>Short-term Goal</div>
                      <div style={{ fontSize: '14px' }}>Attend 3 out of the next 4 classes to reach 72% attendance</div>
                    </div>
                    <div style={{ background: '#1a2349', padding: '16px', borderRadius: '10px' }}>
                      <div style={{ fontWeight: '600', marginBottom: '8px' }}>Long-term Goal</div>
                      <div style={{ fontSize: '14px' }}>Maintain 85% attendance for 4 consecutive weeks</div>
                    </div>
                  </div>

                  <div>
                    <h3>Catch-Up Options</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      <button className="btn ghost">📹 Watch Recorded Lectures</button>
                      <button className="btn ghost">🎓 Schedule Make-up Class</button>
                      <button className="btn ghost">🔄 Request Alternate Batch</button>
                    </div>

                    <h3>Weekly Attendance Streak</h3>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                      {[{ day: 'Mon', status: '✓', color: '#16a34a' }, { day: 'Tue', status: '✓', color: '#16a34a' }, { day: 'Wed', status: '✗', color: '#ff6b6b' }, { day: 'Thu', status: '✓', color: '#16a34a' }, { day: 'Fri', status: '?', color: '#f59e0b' }].map((item, idx) => (
                        <div key={idx} style={{ flex: 1, textAlign: 'center', padding: '12px', background: item.color, borderRadius: '8px' }}>
                          <div style={{ fontSize: '12px' }}>{item.day}</div>
                          <div style={{ fontWeight: '700' }}>{item.status}</div>
                        </div>
                      ))}
                    </div>

                    <button className="btn primary" style={{ width: '100%' }}>Set Daily Reminder</button>
                  </div>
                </div>
              </section>
            )}

            {/* Mental Wellness Page */}
            {activePage === 'wellnessPage' && (
              <section className="card" style={{ gridColumn: '1 / -1' }}>
                <h2>Mental Wellness Center</h2>
                <p style={{ color: '#7b7b8a', marginBottom: '20px' }}>Your space for emotional well-being and stress management</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <h3>How are you feeling today?</h3>
                    <div className="mood-options">
                      {[{ emoji: '😊', label: 'Great' }, { emoji: '🙂', label: 'Good' }, { emoji: '😐', label: 'Okay' }, { emoji: '😔', label: 'Struggling' }, { emoji: '😢', label: 'Need Help' }].map((mood, idx) => (
                        <button key={idx} className={`mood-option ${selectedMood === idx ? 'selected' : ''}`} onClick={() => setSelectedMood(idx)}>
                          {mood.emoji}<br />{mood.label}
                        </button>
                      ))}
                    </div>

                    <h3 style={{ marginTop: '24px' }}>Quick Stress Relief</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button className="btn ghost">🫁 Breathing Exercise</button>
                      <button className="btn ghost">☕ Take a Break</button>
                      <button className="btn ghost">🎵 Relaxing Sounds</button>
                      <button className="btn ghost">🧘 Mindfulness Tip</button>
                    </div>
                  </div>

                  <div>
                    <h3>Support Resources</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      <button className="btn secondary">📞 Book Counselor Session</button>
                      <button className="btn ghost">📚 Wellness Resources</button>
                      <button className="btn ghost">👥 Join Support Group</button>
                      <button className="btn ghost">🆘 Emergency Help</button>
                    </div>

                    <h3>Your Wellness Streak</h3>
                    <div style={{ background: '#1a2349', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: '#16a34a' }}>5</div>
                      <div style={{ fontSize: '14px', color: '#7b7b8a' }}>Days of consistent wellness check-ins</div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Risk Assessment Page */}
            {activePage === 'riskPage' && (
              <section className="card" style={{ gridColumn: '1 / -1' }}>
                <h2>Student Dropout Risk Assessment</h2>
                <p style={{ color: '#7b7b8a', marginBottom: '20px' }}>Early identification and intervention for at-risk students</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px', marginBottom: '20px' }}>
                  <div className="stat-card">
                    <div>Risk Level</div>
                    <div className="stat-number">Medium</div>
                    <div style={{ fontSize: '14px' }}>45% probability</div>
                  </div>
                  <div className="stat-card">
                    <div>Intervention Status</div>
                    <div className="stat-number">Active</div>
                    <div style={{ fontSize: '14px' }}>2 programs enrolled</div>
                  </div>
                  <div className="stat-card">
                    <div>Progress Trend</div>
                    <div className="stat-number">📈 Improving</div>
                    <div style={{ fontSize: '14px' }}>+12% last month</div>
                  </div>
                </div>

                <h4>Risk Factors Breakdown</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[{ label: 'Academic Performance', risk: 45 }, { label: 'Attendance', risk: 32 }, { label: 'Assignment Completion', risk: 38 }, { label: 'Mental Wellness', risk: 25 }].map((item, idx) => (
                    <div className="stat-card" key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>{item.label}</span>
                        <span>{item.risk}%</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${item.risk}%` }}></div></div>
                    </div>
                  ))}
                </div>

                <h4 style={{ marginTop: '20px' }}>Intervention Recommendations</h4>
                <div style={{ background: '#1a2349', padding: '16px', borderRadius: '8px' }}>
                  {[
                    'Attend weekly mentor sessions for academic support',
                    'Participate in attendance improvement program',
                    'Complete all pending assignments',
                    'Join peer study groups',
                    'Schedule counseling sessions'
                  ].map((rec, idx) => (
                    <div key={idx} style={{ padding: '10px', marginBottom: '8px', borderLeft: '3px solid #A2F4F9', background: 'rgba(162,244,249,0.1)', borderRadius: '0 8px 8px 0' }}>
                      {rec}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Support Network Page */}
            {activePage === 'supportPage' && (
              <section className="card" style={{ gridColumn: '1 / -1' }}>
                <h2>Your Support Network</h2>
                <p style={{ color: '#7b7b8a', marginBottom: '20px' }}>Connect with people who can help you succeed</p>

                {studentData.mentors.map(mentor => (
                  <div key={mentor.id} className="mentor-card">
                    <div className="mentor-avatar">{mentor.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600' }}>{mentor.name}</div>
                      <div style={{ fontSize: '12px', color: '#7b7b8a' }}>{mentor.subject} Mentor</div>
                      <div style={{ marginTop: '8px', fontSize: '13px' }}>{mentor.message}</div>
                    </div>
                    <button className="btn primary" style={{ padding: '8px 12px', fontSize: '12px' }}>Contact</button>
                  </div>
                ))}
              </section>
            )}

            {/* Goal Setting Page */}
            {activePage === 'goalsPage' && (
              <section className="card" style={{ gridColumn: '1 / -1' }}>
                <h2>Goal Setting & Tracking</h2>
                <p style={{ color: '#7b7b8a', marginBottom: '20px' }}>Set and track your academic and personal goals</p>

                <div style={{ background: '#1a2349', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
                  <h3>Create New Goal</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <input type="text" placeholder="Goal title" value={newGoalTitle} onChange={(e) => setNewGoalTitle(e.target.value)} />
                    <input type="date" value={newGoalDeadline} onChange={(e) => setNewGoalDeadline(e.target.value)} />
                    <input type="number" placeholder="Target value" value={newGoalTarget} onChange={(e) => setNewGoalTarget(e.target.value)} />
                  </div>
                  <button className="btn primary" onClick={handleAddGoal} style={{ width: '100%' }}>Add Goal</button>
                </div>

                <h3>Your Goals</h3>
                {goals.map(goal => (
                  <div key={goal.id} style={{ background: '#1a2349', padding: '16px', borderRadius: '10px', marginBottom: '12px', borderLeft: '4px solid #A2F4F9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h4>{goal.title}</h4>
                      <span style={{ fontWeight: 'bold', color: '#A2F4F9' }}>{goal.current}/{goal.target}</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${(goal.current / goal.target) * 100}%` }}></div></div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button className="btn ghost" style={{ flex: 1, padding: '6px', fontSize: '12px' }} onClick={() => { const idx = goals.indexOf(goal); const newGoals = [...goals]; newGoals[idx].current = Math.min(newGoals[idx].current + 5, newGoals[idx].target); setGoals(newGoals); }}>+5%</button>
                      <button className="btn ghost" style={{ flex: 1, padding: '6px', fontSize: '12px' }}>Delete</button>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Resources Page */}
            {activePage === 'resourcesPage' && (
              <section className="card" style={{ gridColumn: '1 / -1' }}>
                <h2>Learning Resources</h2>
                <p style={{ color: '#7b7b8a', marginBottom: '20px' }}>Access materials to help with your studies and preparation</p>

                <h3>Previous Year Question Papers</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                  {['Mathematics', 'Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks', 'Algorithms'].map((subject, idx) => (
                    <button key={idx} className="pyq-card" style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{subject}</div>
                      <div style={{ fontSize: '12px', color: '#7b7b8a' }}>2024, 2023, 2022</div>
                    </button>
                  ))}
                </div>

                <h3>Emergency Contacts</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {[{ name: 'Campus Counselling', phone: '555-1234', email: 'counselling@ait.edu' }, { name: 'Academic Advisor', phone: 'Dr. Sharma: 555-5678', email: 'r.sharma@ait.edu' }, { name: '24/7 Crisis Line', phone: '555-9012', email: 'Available anytime' }].map((contact, idx) => (
                    <div className="stat-card" key={idx} style={{ textAlign: 'left' }}>
                      <strong>{contact.name}</strong>
                      <div style={{ fontSize: '12px', marginTop: '8px' }}>{contact.phone}</div>
                      <div style={{ fontSize: '12px', color: '#7b7b8a' }}>{contact.email}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Upload & Search Page */}
            {activePage === 'uploadPage' && (
              <section className="card" style={{ gridColumn: '1 / -1' }}>
                <h2>Learning Resources</h2>
                <p style={{ color: '#7b7b8a', marginBottom: '20px' }}>Upload or search study materials</p>

                <div style={{ marginBottom: '20px' }}>
                  <label><strong>📂 Upload from your computer:</strong></label>
                  <input type="file" multiple onChange={handleFileUpload} style={{ marginTop: '8px' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label><strong>🔎 Search on Google:</strong></label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <input type="text" placeholder="Enter topic..." value={googleSearch} onChange={(e) => setGoogleSearch(e.target.value)} style={{ flex: 1 }} />
                    <button className="btn primary" onClick={handleGoogleSearch}>Search</button>
                  </div>
                </div>

                {searchHistory.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h3>📜 Search History</h3>
                    {searchHistory.map((item, idx) => (
                      <div key={idx} style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ cursor: 'pointer', color: '#A2F4F9' }} onClick={() => { setGoogleSearch(item); handleGoogleSearch(); }}>{item}</span>
                        <button className="btn ghost" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => { const newHistory = searchHistory.filter((_, i) => i !== idx); setSearchHistory(newHistory); }}>Delete</button>
                      </div>
                    ))}
                  </div>
                )}

                <h3>📘 Your Uploaded Resources</h3>
                {uploadedResources.length === 0 ? (
                  <div style={{ color: '#7b7b8a', padding: '16px', textAlign: 'center' }}>No resources uploaded yet</div>
                ) : (
                  uploadedResources.map(resource => (
                    <div key={resource.id} style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{resource.name}</span>
                      <button className="btn ghost" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => setUploadedResources(uploadedResources.filter(r => r.id !== resource.id))}>Delete</button>
                    </div>
                  ))
                )}
              </section>
            )}

          </div>
        </main>
      </div>
    </div>
  );

  function toggleProfileDropdown() {
    setProfileDropdownVisible(!profileDropdownVisible);
  }
};

export default Counseling;
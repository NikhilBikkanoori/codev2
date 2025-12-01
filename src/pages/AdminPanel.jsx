import React, { useEffect, useState, useCallback, memo, useRef } from 'react';
import {
  adminFetchStudents,
  adminCreateStudent,
  adminImportStudentsCSV,
  adminFetchFaculty,
  adminCreateFaculty,
  adminFetchParents,
  adminCreateParent,
  adminFetchDepartments,
  adminCreateDepartment,
  adminFetchAttendance,
  adminCreateAttendance,
  adminFetchExams,
  adminCreateExam,
  adminFetchFees,
  adminCreateFee,
  adminExportAll
} from '../utils/api';
import { useAuth } from '../utils/AuthContext';

const SectionWrapper = ({ title, children, actions }) => (
  <section className="bg-white rounded shadow p-4 mb-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex gap-2">{actions}</div>
    </div>
    {children}
  </section>
);

// Completely isolated Student Form Component
function StudentFormComponent({ studentForm, setStudentForm, onSubmit, students }) {
  return (
    <SectionWrapper title="Students">
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-3 mb-4">
        <input 
          value={studentForm.name} 
          onChange={(e) => setStudentForm(prev => ({...prev, name: e.target.value}))} 
          placeholder='Name' 
          className='border p-2 rounded' 
          required 
        />
        <input 
          value={studentForm.roll} 
          onChange={(e) => setStudentForm(prev => ({...prev, roll: e.target.value}))} 
          placeholder='Roll' 
          className='border p-2 rounded' 
          required 
        />
        <input 
          value={studentForm.email} 
          onChange={(e) => setStudentForm(prev => ({...prev, email: e.target.value}))} 
          placeholder='Email' 
          className='border p-2 rounded' 
        />
        <input 
          value={studentForm.phone} 
          onChange={(e) => setStudentForm(prev => ({...prev, phone: e.target.value}))} 
          placeholder='Phone' 
          className='border p-2 rounded' 
        />
        <button className='col-span-2 bg-purple-600 text-white py-2 rounded'>Add Student</button>
      </form>
      <ul className="space-y-2">
        {students.map(s => (
          <li key={s._id} className="bg-gray-50 p-3 rounded flex justify-between">
            <div>
              <strong>{s.name}</strong> <span className='text-xs text-gray-600'>({s.roll})</span>
              <div className='text-xs text-gray-500'>{s.email || '—'} • {s.phone || '—'}</div>
            </div>
          </li>
        ))}
        {students.length === 0 && <li className='text-sm text-gray-500'>No students.</li>}
      </ul>
    </SectionWrapper>
  );
}

// Completely isolated Faculty Form Component
function FacultyFormComponent({ facultyForm, setFacultyForm, onSubmit, faculty }) {
  return (
    <SectionWrapper title="Faculty">
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-3 mb-4">
        <input 
          value={facultyForm.name} 
          onChange={(e) => setFacultyForm(prev => ({...prev, name: e.target.value}))} 
          placeholder='Name' 
          className='border p-2 rounded' 
          required 
        />
        <input 
          value={facultyForm.fid} 
          onChange={(e) => setFacultyForm(prev => ({...prev, fid: e.target.value}))} 
          placeholder='Faculty ID' 
          className='border p-2 rounded' 
          required 
        />
        <input 
          value={facultyForm.email} 
          onChange={(e) => setFacultyForm(prev => ({...prev, email: e.target.value}))} 
          placeholder='Email' 
          className='border p-2 rounded' 
        />
        <button className='col-span-2 bg-purple-600 text-white py-2 rounded'>Add Faculty</button>
      </form>
      <ul className='space-y-2'>
        {faculty.map(f => (
          <li key={f._id} className='bg-gray-50 p-3 rounded flex justify-between'>
            <div><strong>{f.name}</strong> <span className='text-xs text-gray-600'>({f.fid})</span></div>
          </li>
        ))}
        {faculty.length === 0 && <li className='text-sm text-gray-500'>No faculty.</li>}
      </ul>
    </SectionWrapper>
  );
}


const AdminPanel = () => {
  const { user } = useAuth();
  const [active, setActive] = useState('students');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // datasets
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [parents, setParents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [exams, setExams] = useState([]);
  const [fees, setFees] = useState([]);

  // form states (simple minimal version)
  const [studentForm, setStudentForm] = useState({ name: '', roll: '', email: '', phone: '' });
  const [facultyForm, setFacultyForm] = useState({ name: '', fid: '', email: '' });
  const [parentForm, setParentForm] = useState({ name: '', pid: '', email: '' });
  const [deptForm, setDeptForm] = useState({ name: '' });
  const [attForm, setAttForm] = useState({ studentRoll: '', date: '', status: 'Present' });
  const [examForm, setExamForm] = useState({ roll: '', subject: '', examName: '', marks: '' });
  const [feeForm, setFeeForm] = useState({ roll: '', total: '', paid: '' });

  const isAdmin = user?.role === 'admin';

  // Generic form field update handler
  const handleFormChange = useCallback((formName, updates) => {
    if (formName === 'studentForm') setStudentForm(prev => ({...prev, ...updates}));
    else if (formName === 'facultyForm') setFacultyForm(prev => ({...prev, ...updates}));
    else if (formName === 'parentForm') setParentForm(prev => ({...prev, ...updates}));
    else if (formName === 'deptForm') setDeptForm(prev => ({...prev, ...updates}));
    else if (formName === 'attForm') setAttForm(prev => ({...prev, ...updates}));
    else if (formName === 'examForm') setExamForm(prev => ({...prev, ...updates}));
    else if (formName === 'feeForm') setFeeForm(prev => ({...prev, ...updates}));
  }, []);

  const loadData = async () => {
    if (!isAdmin) return;
    setLoading(true); setError('');
    try {
      const [s, f, p, d, a, e, fe] = await Promise.all([
        adminFetchStudents(),
        adminFetchFaculty(),
        adminFetchParents(),
        adminFetchDepartments(),
        adminFetchAttendance(),
        adminFetchExams(),
        adminFetchFees()
      ]);
      setStudents(s.data); setFaculty(f.data); setParents(p.data); setDepartments(d.data);
      setAttendance(a.data); setExams(e.data); setFees(fe.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load admin data');
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []); // initial

  const handleCreateStudent = useCallback(async (e) => {
    e.preventDefault(); setError('');
    try {
      await adminCreateStudent(studentForm); setStudentForm({ name: '', roll: '', email: '', phone: '' }); loadData();
    } catch (err) { setError(err.response?.data?.msg || 'Create student failed'); }
  }, [studentForm]);

  const handleCreateFaculty = useCallback(async (e) => { 
    e.preventDefault(); 
    try { 
      await adminCreateFaculty(facultyForm); 
      setFacultyForm({ name: '', fid: '', email: '' }); 
      loadData(); 
    } catch (err) { 
      setError('Create faculty failed'); 
    } 
  }, [facultyForm]);

  const handleCreateParent = async (e) => { 
    e.preventDefault(); 
    try { 
      await adminCreateParent(parentForm); 
      setParentForm({ name: '', pid: '', email: '' }); 
      loadData(); 
    } catch (err) { 
      setError('Create parent failed'); 
    } 
  };

  const handleCreateDept = async (e) => { 
    e.preventDefault(); 
    try { 
      await adminCreateDepartment(deptForm); 
      setDeptForm({ name: '' }); 
      loadData(); 
    } catch (err) { 
      setError('Create department failed'); 
    } 
  };

  const handleCreateAttendance = async (e) => { 
    e.preventDefault(); 
    try { 
      await adminCreateAttendance(attForm); 
      setAttForm({ studentRoll: '', date: '', status: 'Present' }); 
      loadData(); 
    } catch (err) { 
      setError('Create attendance failed'); 
    } 
  };

  const handleCreateExam = async (e) => { 
    e.preventDefault(); 
    try { 
      await adminCreateExam(examForm); 
      setExamForm({ roll: '', subject: '', examName: '', marks: '' }); 
      loadData(); 
    } catch (err) { 
      setError('Create exam failed'); 
    } 
  };

  const handleCreateFee = async (e) => { 
    e.preventDefault(); 
    try { 
      await adminCreateFee(feeForm); 
      setFeeForm({ roll: '', total: '', paid: '' }); 
      loadData(); 
    } catch (err) { 
      setError('Create fee failed'); 
    } 
  };

  const handleExportAll = async () => {
    try { const res = await adminExportAll(); const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'dropshield-admin-export.json'; a.click(); URL.revokeObjectURL(a.href); } catch { setError('Export failed'); }
  };

  if (!isAdmin) return <div className="p-8 text-center">Access denied. Admin only.</div>;

  const TabButton = ({ id, label }) => (
    <button onClick={() => setActive(id)} className={`px-3 py-2 rounded text-sm font-medium ${active === id ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'} transition`}>{label}</button>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-purple-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <div className="flex gap-2">
          <label className="bg-green-600 px-3 py-1 rounded cursor-pointer text-sm">CSV Import
            <input type="file" accept='.csv' onChange={handleImportCSV} className="hidden" />
          </label>
          <button onClick={handleExportAll} className="bg-orange-500 px-3 py-1 rounded text-sm">Export JSON</button>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-gray-800 text-white p-4 space-y-2">
          <TabButton id="students" label="Students" />
          <TabButton id="faculty" label="Faculty" />
          <TabButton id="parents" label="Parents" />
          <TabButton id="departments" label="Departments" />
          <TabButton id="attendance" label="Attendance" />
          <TabButton id="exams" label="Exams" />
          <TabButton id="fees" label="Fees" />
        </aside>
        <main className="flex-1 p-6">
          {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
          {loading && <div className="mb-4 text-sm text-gray-600">Loading...</div>}

          {active === 'students' && (
            <StudentFormComponent 
              studentForm={studentForm}
              setStudentForm={setStudentForm}
              onSubmit={handleCreateStudent}
              students={students}
            />
          )}

          {active === 'faculty' && (
            <FacultyFormComponent 
              facultyForm={facultyForm}
              setFacultyForm={setFacultyForm}
              onSubmit={handleCreateFaculty}
              faculty={faculty}
            />
          )}

          {active === 'parents' && (
            <SectionWrapper title="Parents" actions={null}>
              <form onSubmit={handleCreateParent} className="grid grid-cols-2 gap-3 mb-4">
                <input 
                  key="parent-name"
                  value={parentForm.name} 
                  onChange={e=>setParentForm(prev=>({...prev, name:e.target.value}))} 
                  placeholder='Name' 
                  className='border p-2 rounded' 
                  required 
                />
                <input 
                  key="parent-pid"
                  value={parentForm.pid} 
                  onChange={e=>setParentForm(prev=>({...prev, pid:e.target.value}))} 
                  placeholder='Parent ID' 
                  className='border p-2 rounded' 
                  required 
                />
                <input 
                  key="parent-email"
                  value={parentForm.email} 
                  onChange={e=>setParentForm(prev=>({...prev, email:e.target.value}))} 
                  placeholder='Email' 
                  className='border p-2 rounded' 
                />
                <button className='col-span-2 bg-purple-600 text-white py-2 rounded'>Add Parent</button>
              </form>
              <ul className='space-y-2'>
                {parents.map(p => (
                  <li key={p._id} className='bg-gray-50 p-3 rounded flex justify-between'>
                    <div><strong>{p.name}</strong> <span className='text-xs text-gray-600'>({p.pid})</span></div>
                  </li>
                ))}
                {parents.length === 0 && <li className='text-sm text-gray-500'>No parents.</li>}
              </ul>
            </SectionWrapper>
          )}

          {active === 'departments' && (
            <SectionWrapper title="Departments" actions={null}>
              <form onSubmit={handleCreateDept} className="flex gap-3 mb-4">
                <input 
                  key="dept-name"
                  value={deptForm.name} 
                  onChange={e=>setDeptForm(prev=>({ name: e.target.value }))} 
                  placeholder='Department Name' 
                  className='border p-2 rounded flex-1' 
                  required 
                />
                <button className='bg-purple-600 text-white px-4 rounded'>Add Dept</button>
              </form>
              <ul className='space-y-2'>
                {departments.map(d => (
                  <li key={d._id} className='bg-gray-50 p-3 rounded flex justify-between'>
                    <div><strong>{d.name}</strong></div>
                  </li>
                ))}
                {departments.length === 0 && <li className='text-sm text-gray-500'>No departments.</li>}
              </ul>
            </SectionWrapper>
          )}

          {active === 'attendance' && (
            <SectionWrapper title="Attendance" actions={null}>
              <form onSubmit={handleCreateAttendance} className="grid grid-cols-3 gap-3 mb-4">
                <input 
                  key="att-roll"
                  value={attForm.studentRoll} 
                  onChange={e=>setAttForm(prev=>({...prev, studentRoll:e.target.value}))} 
                  placeholder='Student Roll' 
                  className='border p-2 rounded' 
                  required 
                />
                <input 
                  key="att-date"
                  type='date' 
                  value={attForm.date} 
                  onChange={e=>setAttForm(prev=>({...prev, date:e.target.value}))} 
                  className='border p-2 rounded' 
                  required 
                />
                <select 
                  key="att-status"
                  value={attForm.status} 
                  onChange={e=>setAttForm(prev=>({...prev, status:e.target.value}))} 
                  className='border p-2 rounded'
                >
                  <option>Present</option><option>Absent</option>
                </select>
                <button className='col-span-3 bg-purple-600 text-white py-2 rounded'>Add Attendance</button>
              </form>
              <ul className='space-y-2'>
                {attendance.map(a => (
                  <li key={a._id} className='bg-gray-50 p-3 rounded flex justify-between'>
                    <div>{a.studentRoll} - {new Date(a.date).toLocaleDateString()} : {a.status}</div>
                  </li>
                ))}
                {attendance.length === 0 && <li className='text-sm text-gray-500'>No attendance.</li>}
              </ul>
            </SectionWrapper>
          )}

          {active === 'exams' && (
            <SectionWrapper title="Exams" actions={null}>
              <form onSubmit={handleCreateExam} className='grid grid-cols-4 gap-3 mb-4'>
                <input 
                  key="exam-roll"
                  value={examForm.roll} 
                  onChange={e=>setExamForm(prev=>({...prev, roll:e.target.value}))} 
                  placeholder='Roll' 
                  className='border p-2 rounded' 
                  required 
                />
                <input 
                  key="exam-subject"
                  value={examForm.subject} 
                  onChange={e=>setExamForm(prev=>({...prev, subject:e.target.value}))} 
                  placeholder='Subject' 
                  className='border p-2 rounded' 
                  required 
                />
                <input 
                  key="exam-name"
                  value={examForm.examName} 
                  onChange={e=>setExamForm(prev=>({...prev, examName:e.target.value}))} 
                  placeholder='Exam Name' 
                  className='border p-2 rounded' 
                  required 
                />
                <input 
                  key="exam-marks"
                  type='number' 
                  value={examForm.marks} 
                  onChange={e=>setExamForm(prev=>({...prev, marks:e.target.value}))} 
                  placeholder='Marks' 
                  className='border p-2 rounded' 
                  required 
                />
                <button className='col-span-4 bg-purple-600 text-white py-2 rounded'>Add Exam</button>
              </form>
              <ul className='space-y-2'>
                {exams.map(x => (
                  <li key={x._id} className='bg-gray-50 p-3 rounded flex justify-between'>
                    <div>{x.roll} - {x.examName} ({x.subject}) : {x.marks}</div>
                  </li>
                ))}
                {exams.length === 0 && <li className='text-sm text-gray-500'>No exams.</li>}
              </ul>
            </SectionWrapper>
          )}

          {active === 'fees' && (
            <SectionWrapper title="Fees" actions={null}>
              <form onSubmit={handleCreateFee} className='grid grid-cols-3 gap-3 mb-4'>
                <input 
                  key="fee-roll"
                  value={feeForm.roll} 
                  onChange={e=>setFeeForm(prev=>({...prev, roll:e.target.value}))} 
                  placeholder='Roll' 
                  className='border p-2 rounded' 
                  required 
                />
                <input 
                  key="fee-total"
                  type='number' 
                  value={feeForm.total} 
                  onChange={e=>setFeeForm(prev=>({...prev, total:e.target.value}))} 
                  placeholder='Total' 
                  className='border p-2 rounded' 
                  required 
                />
                <input 
                  key="fee-paid"
                  type='number' 
                  value={feeForm.paid} 
                  onChange={e=>setFeeForm(prev=>({...prev, paid:e.target.value}))} 
                  placeholder='Paid' 
                  className='border p-2 rounded' 
                  required 
                />
                <button className='col-span-3 bg-purple-600 text-white py-2 rounded'>Add Fee</button>
              </form>
              <ul className='space-y-2'>
                {fees.map(f => (
                  <li key={f._id} className='bg-gray-50 p-3 rounded flex justify-between'>
                    <div>{f.roll} - Paid {f.paid}/{f.total}</div>
                  </li>
                ))}
                {fees.length === 0 && <li className='text-sm text-gray-500'>No fees.</li>}
              </ul>
            </SectionWrapper>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminPanel;

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../utils/AuthContext';
import {
  adminFetchStudents, adminCreateStudent, adminUpdateStudent, adminDeleteStudent,
  adminFetchFaculty, adminCreateFaculty, adminUpdateFaculty, adminDeleteFaculty,
  adminFetchParents, adminCreateParent, adminUpdateParent, adminDeleteParent,
  adminFetchDepartments, adminCreateDepartment, adminUpdateDepartment, adminDeleteDepartment,
  adminFetchAttendance, adminCreateAttendance, adminUpdateAttendance, adminDeleteAttendance,
  adminFetchExams, adminCreateExam, adminUpdateExam, adminDeleteExam,
  adminFetchFees, adminCreateFee, adminUpdateFee, adminDeleteFee,
  adminExportAll, adminCreateAdmin, adminDeleteAdmin,
  API_BASE_URL
} from '../utils/api';

// Utility: open print window
const printHtml = (title, html) => {
  const w = window.open('', '', 'width=1000,height=800');
  w.document.write(`<html><head><title>${title}</title><style>body{font-family:Arial;padding:20px}ul{list-style:none;padding:0}h2{margin-top:24px}</style></head><body>${html}</body></html>`);
  w.document.close(); w.focus(); w.print(); w.close();
};

const genderOptions = ['', 'Male', 'Female', 'Other'];

const unwrapId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value._id || '';
};

const extractStudentIdentifier = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.roll || value.name || value._id || '';
};

const formatLinkedStudentLabel = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const roll = value.roll ? String(value.roll) : '';
  const name = value.name ? String(value.name) : '';
  if (roll && name) return `${roll} – ${name}`;
  return roll || name || '';
};

const Section = ({ id, isActive, children }) => (
  <section id={id} className={isActive ? '' : 'hidden'}>
    {children}
  </section>
);

const AdminV4Panel = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [active, setActive] = useState('students');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data sets
  const [students,setStudents] = useState([]);
  const [faculty,setFaculty] = useState([]);
  const [parents,setParents] = useState([]);
  const [departments,setDepartments] = useState([]);
  const [attendance,setAttendance] = useState([]);
  const [exams,setExams] = useState([]);
  const [fees,setFees] = useState([]);
  const [admins,setAdmins] = useState([]);

  // Search queries
  const [qStudent,setQStudent] = useState('');
  const [qFaculty,setQFaculty] = useState('');
  const [qParent,setQParent] = useState('');
  const [qDept,setQDept] = useState('');
  const [qExam,setQExam] = useState('');
  const [qAtt,setQAtt] = useState('');
  const [qAdmin,setQAdmin] = useState('');

  // Forms
  const [studentForm,setStudentForm] = useState({ name:'', roll:'', email:'', phone:'', gender:'', dob:'', address:'', deptId:'', parentId:'', username:'', password:'', file:null });
  const [facultyForm,setFacultyForm] = useState({ name:'', fid:'', email:'', phone:'', dob:'', gender:'', address:'', deptId:'', salary:'', username:'', password:'' });
  const [parentForm,setParentForm] = useState({ name:'', pid:'', email:'', phone:'', address:'', linkedStudent:'', username:'', password:'' });
  const [deptForm,setDeptForm] = useState({ name:'', hod:'' });
  const [attForm,setAttForm] = useState({ studentRoll:'', date:'', status:'Present' });
  const [examForm,setExamForm] = useState({ roll:'', subject:'', examName:'', marks:'' });
  const [feeForm,setFeeForm] = useState({ roll:'', total:'', paid:'' });
  const [adminForm,setAdminForm] = useState({ name:'', email:'', password:'' });

  // Edit indexes (store id being edited)
  const [edit,setEdit] = useState({ student:null, faculty:null, parent:null, dept:null, att:null, exam:null, fee:null, admin:null });

  const resetForms = () => {
    setStudentForm({ name:'', roll:'', email:'', phone:'', gender:'', dob:'', address:'', deptId:'', parentId:'', username:'', password:'', file:null });
    setFacultyForm({ name:'', fid:'', email:'', phone:'', dob:'', gender:'', address:'', deptId:'', salary:'', username:'', password:'' });
    setParentForm({ name:'', pid:'', email:'', phone:'', address:'', linkedStudent:'', username:'', password:'' });
    setDeptForm({ name:'', hod:'' }); setAttForm({ studentRoll:'', date:'', status:'Present' }); setExamForm({ roll:'', subject:'', examName:'', marks:'' }); setFeeForm({ roll:'', total:'', paid:'' }); setAdminForm({ name:'', email:'', password:'' });
    setEdit({ student:null, faculty:null, parent:null, dept:null, att:null, exam:null, fee:null, admin:null });
  };

  // Form update handlers using useCallback to prevent re-renders
  const updateStudentForm = useCallback((field, value) => {
    setStudentForm(prev => ({...prev, [field]: value}));
  }, []);

  const updateFacultyForm = useCallback((field, value) => {
    setFacultyForm(prev => ({...prev, [field]: value}));
  }, []);

  const updateParentForm = useCallback((field, value) => {
    setParentForm(prev => ({...prev, [field]: value}));
  }, []);

  const updateDeptForm = useCallback((field, value) => {
    setDeptForm(prev => ({...prev, [field]: value}));
  }, []);

  const updateAttForm = useCallback((field, value) => {
    setAttForm(prev => ({...prev, [field]: value}));
  }, []);

  const updateExamForm = useCallback((field, value) => {
    setExamForm(prev => ({...prev, [field]: value}));
  }, []);

  const updateFeeForm = useCallback((field, value) => {
    setFeeForm(prev => ({...prev, [field]: value}));
  }, []);

  const updateAdminForm = useCallback((field, value) => {
    setAdminForm(prev => ({...prev, [field]: value}));
  }, []);

  // Stable per-field handlers for student form
  const onStudentNameChange = useCallback((e) => updateStudentForm('name', e.target.value), [updateStudentForm]);
  const onStudentRollChange = useCallback((e) => updateStudentForm('roll', e.target.value), [updateStudentForm]);
  const onStudentEmailChange = useCallback((e) => updateStudentForm('email', e.target.value), [updateStudentForm]);
  const onStudentPhoneChange = useCallback((e) => updateStudentForm('phone', e.target.value), [updateStudentForm]);
  const onStudentDobChange = useCallback((e) => updateStudentForm('dob', e.target.value), [updateStudentForm]);
  const onStudentGenderChange = useCallback((e) => updateStudentForm('gender', e.target.value), [updateStudentForm]);
  const onStudentAddressChange = useCallback((e) => updateStudentForm('address', e.target.value), [updateStudentForm]);
  const onStudentDeptChange = useCallback((e) => updateStudentForm('deptId', e.target.value), [updateStudentForm]);
  const onStudentParentChange = useCallback((e) => updateStudentForm('parentId', e.target.value), [updateStudentForm]);
  const onStudentUsernameChange = useCallback((e) => updateStudentForm('username', e.target.value), [updateStudentForm]);
  const onStudentPasswordChange = useCallback((e) => updateStudentForm('password', e.target.value), [updateStudentForm]);

  // Faculty handlers
  const onFacultyNameChange = useCallback((e) => updateFacultyForm('name', e.target.value), [updateFacultyForm]);
  const onFacultyFidChange = useCallback((e) => updateFacultyForm('fid', e.target.value), [updateFacultyForm]);
  const onFacultyEmailChange = useCallback((e) => updateFacultyForm('email', e.target.value), [updateFacultyForm]);
  const onFacultyPhoneChange = useCallback((e) => updateFacultyForm('phone', e.target.value), [updateFacultyForm]);
  const onFacultyDobChange = useCallback((e) => updateFacultyForm('dob', e.target.value), [updateFacultyForm]);
  const onFacultyGenderChange = useCallback((e) => updateFacultyForm('gender', e.target.value), [updateFacultyForm]);
  const onFacultyAddressChange = useCallback((e) => updateFacultyForm('address', e.target.value), [updateFacultyForm]);
  const onFacultyDeptChange = useCallback((e) => updateFacultyForm('deptId', e.target.value), [updateFacultyForm]);
  const onFacultySalaryChange = useCallback((e) => updateFacultyForm('salary', e.target.value), [updateFacultyForm]);
  const onFacultyUsernameChange = useCallback((e) => updateFacultyForm('username', e.target.value), [updateFacultyForm]);
  const onFacultyPasswordChange = useCallback((e) => updateFacultyForm('password', e.target.value), [updateFacultyForm]);

  // Parent handlers
  const onParentNameChange = useCallback((e) => updateParentForm('name', e.target.value), [updateParentForm]);
  const onParentPidChange = useCallback((e) => updateParentForm('pid', e.target.value), [updateParentForm]);
  const onParentEmailChange = useCallback((e) => updateParentForm('email', e.target.value), [updateParentForm]);
  const onParentPhoneChange = useCallback((e) => updateParentForm('phone', e.target.value), [updateParentForm]);
  const onParentAddressChange = useCallback((e) => updateParentForm('address', e.target.value), [updateParentForm]);
  const onParentLinkedChange = useCallback((e) => updateParentForm('linkedStudent', e.target.value), [updateParentForm]);
  const onParentUsernameChange = useCallback((e) => updateParentForm('username', e.target.value), [updateParentForm]);
  const onParentPasswordChange = useCallback((e) => updateParentForm('password', e.target.value), [updateParentForm]);

  // Dept handlers
  const onDeptNameChange = useCallback((e) => updateDeptForm('name', e.target.value), [updateDeptForm]);
  const onDeptHodChange = useCallback((e) => updateDeptForm('hod', e.target.value), [updateDeptForm]);

  // Attendance handlers
  const onAttStudentRollChange = useCallback((e) => updateAttForm('studentRoll', e.target.value), [updateAttForm]);
  const onAttDateChange = useCallback((e) => updateAttForm('date', e.target.value), [updateAttForm]);
  const onAttStatusChange = useCallback((e) => updateAttForm('status', e.target.value), [updateAttForm]);

  // Exam handlers
  const onExamRollChange = useCallback((e) => updateExamForm('roll', e.target.value), [updateExamForm]);
  const onExamSubjectChange = useCallback((e) => updateExamForm('subject', e.target.value), [updateExamForm]);
  const onExamNameChange = useCallback((e) => updateExamForm('examName', e.target.value), [updateExamForm]);
  const onExamMarksChange = useCallback((e) => updateExamForm('marks', e.target.value), [updateExamForm]);

  // Fee handlers
  const onFeeRollChange = useCallback((e) => updateFeeForm('roll', e.target.value), [updateFeeForm]);
  const onFeeTotalChange = useCallback((e) => updateFeeForm('total', e.target.value), [updateFeeForm]);
  const onFeePaidChange = useCallback((e) => updateFeeForm('paid', e.target.value), [updateFeeForm]);

  // Admin handlers
  const onAdminNameChange = useCallback((e) => updateAdminForm('name', e.target.value), [updateAdminForm]);
  const onAdminEmailChange = useCallback((e) => updateAdminForm('email', e.target.value), [updateAdminForm]);
  const onAdminPasswordChange = useCallback((e) => updateAdminForm('password', e.target.value), [updateAdminForm]);

  const loadAll = useCallback(async () => {
    if(!isAdmin) return; setLoading(true); setError('');
    try {
      const [stu, fac, par, dept, att, ex, fe, exp] = await Promise.all([
        adminFetchStudents(), adminFetchFaculty(), adminFetchParents(), adminFetchDepartments(), adminFetchAttendance(), adminFetchExams(), adminFetchFees(), adminExportAll()
      ]);
      setStudents(stu.data); setFaculty(fac.data); setParents(par.data); setDepartments(dept.data); setAttendance(att.data); setExams(ex.data); setFees(fe.data); setAdmins(exp.data.admins || []);
    } catch(e){ setError(e.response?.data?.msg || 'Load failed'); } finally { setLoading(false); }
  }, [isAdmin]);

  useEffect(()=>{ loadAll(); }, [loadAll]);

  const handleCredentialCreate = async (name, emailFallback, username, password, role) => {
    const trimmedPassword = password?.trim();
    const trimmedUsername = username?.trim() || '';
    const normalizedEmail = (emailFallback?.trim()) || (trimmedUsername ? `${trimmedUsername}@dropshield.local` : null);
    if(!normalizedEmail || !trimmedPassword) {
      return { id: null, error: 'Email/username and password are required to create login credentials.' };
    }
    const safeName = name?.trim() || username?.trim() || normalizedEmail.split('@')[0];

    const parseResponseBody = async (response) => {
      const text = await response.text();
      if(!text) return {};
      try {
        return JSON.parse(text);
      } catch {
        return { raw: text };
      }
    };

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          name: safeName,
          email: normalizedEmail,
          username: trimmedUsername || undefined,
          password: trimmedPassword,
          role
        })
      });
      const data = await parseResponseBody(res);
      if(res.ok && data.user?.id) {
        return { id: data.user.id, error: null };
      }
      const message = data?.msg || data?.raw || 'Credential creation failed';
      console.warn('Credential creation failed:', message);
      return { id: null, error: message };
    } catch (err) {
      console.error('Credential creation error:', err);
      return { id: null, error: err.message || 'Credential creation error' };
    }
  };

  const fileToBase64 = (file) => new Promise((resolve,reject)=>{ if(!file) return resolve(null); const r=new FileReader(); r.onload=()=>resolve(r.result); r.onerror=reject; r.readAsDataURL(file); });

  // Student create/update
  const submitStudent = async (e) => { e.preventDefault(); setError('');
    try {
      const base64 = await fileToBase64(studentForm.file);
      const payload = { name:studentForm.name, roll:studentForm.roll, email:studentForm.email, phone:studentForm.phone, dob:studentForm.dob||undefined, gender:studentForm.gender||'', address:studentForm.address, deptId:studentForm.deptId||null, parentId:studentForm.parentId||null, fileName: studentForm.file?.name, fileData: base64 };
      if(edit.student){ await adminUpdateStudent(edit.student, payload); }
      else {
        const { id: userId, error: credError } = await handleCredentialCreate(studentForm.name, studentForm.email, studentForm.username, studentForm.password, 'student');
        if(!userId) throw new Error(credError || 'Failed to create student login. Record not saved.');
        payload.userId = userId;
        await adminCreateStudent(payload);
      }
      resetForms(); loadAll();
    } catch(e){
      const msg = e.response?.data?.msg || e.message || 'Student save failed';
      setError(msg);
    }
  };
  const startEditStudent = (s) => {
    setEdit(ed => ({ ...ed, student: s._id }));
    setStudentForm({
      name: s.name,
      roll: s.roll,
      email: s.email || '',
      phone: s.phone || '',
      gender: s.gender || '',
      dob: s.dob ? s.dob.substring(0, 10) : '',
      address: s.address || '',
      deptId: unwrapId(s.deptId) || s.deptId || '',
      parentId: unwrapId(s.parentId) || extractStudentIdentifier(s.parentId) || '',
      username: '',
      password: '',
      file: null
    });
  };
  const deleteStudent = async (id) => { if(!window.confirm('Delete student?')) return; try { await adminDeleteStudent(id); loadAll(); } catch(e){ setError('Delete failed'); } };

  // Faculty
  const submitFaculty = async (e) => { e.preventDefault(); setError(''); try {
    const payload = { name:facultyForm.name, fid:facultyForm.fid, email:facultyForm.email, phone:facultyForm.phone, dob:facultyForm.dob||undefined, gender:facultyForm.gender||'', address:facultyForm.address, deptId:facultyForm.deptId||null, salary:facultyForm.salary? Number(facultyForm.salary):undefined };
    if(edit.faculty) await adminUpdateFaculty(edit.faculty, payload); else {
      const { id: userId, error: credError } = await handleCredentialCreate(facultyForm.name, facultyForm.email, facultyForm.username, facultyForm.password, 'mentor');
      if(!userId) throw new Error(credError || 'Failed to create mentor login. Record not saved.');
      payload.userId = userId;
      await adminCreateFaculty(payload);
    }
    resetForms(); loadAll(); } catch(e){ setError('Faculty save failed'); } };
  const startEditFaculty = (f) => { setEdit(ed=>({...ed, faculty:f._id})); setFacultyForm({ name:f.name, fid:f.fid, email:f.email||'', phone:f.phone||'', dob:f.dob? f.dob.substring(0,10):'', gender:f.gender||'', address:f.address||'', deptId:f.deptId||'', salary:f.salary||'', username:'', password:'' }); };
  const deleteFaculty = async (id) => { if(!window.confirm('Delete faculty?')) return; try { await adminDeleteFaculty(id); loadAll(); } catch(e){ setError('Delete failed'); } };

  // Parents
  const submitParent = async (e) => { e.preventDefault(); setError(''); try {
    const payload = { name:parentForm.name, pid:parentForm.pid, email:parentForm.email, phone:parentForm.phone, address:parentForm.address, linkedStudent:parentForm.linkedStudent||null };
    if(edit.parent) await adminUpdateParent(edit.parent, payload); else {
      const { id: userId, error: credError } = await handleCredentialCreate(parentForm.name, parentForm.email, parentForm.username, parentForm.password, 'parent');
      if(!userId) throw new Error(credError || 'Failed to create parent login. Record not saved.');
      payload.userId = userId;
      await adminCreateParent(payload);
    }
    resetForms(); loadAll(); } catch(e){ setError('Parent save failed'); } };
  const startEditParent = (p) => {
    setEdit(ed => ({ ...ed, parent: p._id }));
    setParentForm({
      name: p.name,
      pid: p.pid,
      email: p.email || '',
      phone: p.phone || '',
      address: p.address || '',
      linkedStudent: extractStudentIdentifier(p.linkedStudent),
      username: '',
      password: ''
    });
  };
  const deleteParent = async (id) => { if(!window.confirm('Delete parent?')) return; try { await adminDeleteParent(id); loadAll(); } catch(e){ setError('Delete failed'); } };

  // Departments
  const submitDept = async (e) => { e.preventDefault(); setError(''); try {
    const payload = { name:deptForm.name, hod:deptForm.hod||null };
    if(edit.dept) await adminUpdateDepartment(edit.dept, payload); else await adminCreateDepartment(payload);
    resetForms(); loadAll(); } catch(e){ setError('Department save failed'); } };
  const startEditDept = (d) => { setEdit(ed=>({...ed, dept:d._id})); setDeptForm({ name:d.name, hod:d.hod||'' }); };
  const deleteDept = async (id) => { if(!window.confirm('Delete department?')) return; try { await adminDeleteDepartment(id); loadAll(); } catch(e){ setError('Delete failed'); } };

  // Attendance
  const submitAtt = async (e) => { e.preventDefault(); setError(''); try {
    const payload = { studentRoll:attForm.studentRoll, date:attForm.date, status:attForm.status };
    if(edit.att) await adminUpdateAttendance(edit.att, payload); else await adminCreateAttendance(payload);
    resetForms(); loadAll(); } catch(e){ setError('Attendance save failed'); } };
  const startEditAtt = (a) => { setEdit(ed=>({...ed, att:a._id})); setAttForm({ studentRoll:a.studentRoll, date:a.date? a.date.substring(0,10):'', status:a.status }); };
  const deleteAtt = async (id) => { if(!window.confirm('Delete attendance?')) return; try { await adminDeleteAttendance(id); loadAll(); } catch(e){ setError('Delete failed'); } };

  // Exams
  const submitExam = async (e) => { e.preventDefault(); setError(''); try {
    const payload = { roll:examForm.roll, subject:examForm.subject, examName:examForm.examName, marks:Number(examForm.marks) };
    if(edit.exam) await adminUpdateExam(edit.exam, payload); else await adminCreateExam(payload);
    resetForms(); loadAll(); } catch(e){ setError('Exam save failed'); } };
  const startEditExam = (x) => { setEdit(ed=>({...ed, exam:x._id})); setExamForm({ roll:x.roll, subject:x.subject, examName:x.examName, marks:x.marks }); };
  const deleteExam = async (id) => { if(!window.confirm('Delete exam?')) return; try { await adminDeleteExam(id); loadAll(); } catch(e){ setError('Delete failed'); } };

  // Fees
  const submitFee = async (e) => { e.preventDefault(); setError(''); try {
    const payload = { roll:feeForm.roll, total:Number(feeForm.total), paid:Number(feeForm.paid) };
    if(edit.fee) await adminUpdateFee(edit.fee, payload); else await adminCreateFee(payload);
    resetForms(); loadAll(); } catch(e){ setError('Fee save failed'); } };
  const startEditFee = (f) => { setEdit(ed=>({...ed, fee:f._id})); setFeeForm({ roll:f.roll, total:f.total, paid:f.paid }); };
  const deleteFee = async (id) => { if(!window.confirm('Delete fee?')) return; try { await adminDeleteFee(id); loadAll(); } catch(e){ setError('Delete failed'); } };

  // Admins
  const submitAdmin = async (e) => { e.preventDefault(); setError(''); try {
    await adminCreateAdmin(adminForm); resetForms(); loadAll(); } catch(e){ setError(e.response?.data?.msg || 'Admin create failed'); } };
  const deleteAdmin = async (id) => { if(!window.confirm('Delete admin?')) return; try { await adminDeleteAdmin(id); loadAll(); } catch(e){ setError(e.response?.data?.msg || 'Delete admin failed'); } };

  const exportAll = async () => { try { const res = await adminExportAll(); const blob = new Blob([JSON.stringify(res.data,null,2)], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='backup_v4.json'; a.click(); URL.revokeObjectURL(a.href); } catch { setError('Export failed'); } };
  const printAll = () => {
    const html = `<h1>Full Export</h1>` + [
      ['Students', students.map(s=>`${s.name} (${s.roll})`).join('<br>')||'No records'],
      ['Faculty', faculty.map(f=>`${f.name} (${f.fid})`).join('<br>')||'No records'],
      ['Parents', parents.map(p=>`${p.name} (${p.pid})`).join('<br>')||'No records'],
      ['Departments', departments.map(d=>d.name).join('<br>')||'No records'],
      ['Attendance', attendance.map(a=>`${a.studentRoll} - ${new Date(a.date).toLocaleDateString()} : ${a.status}`).join('<br>')||'No records'],
      ['Exams', exams.map(x=>`${x.roll} - ${x.examName} (${x.subject}) : ${x.marks}`).join('<br>')||'No records'],
      ['Fees', fees.map(f=>`${f.roll} - ${f.paid}/${f.total}`).join('<br>')||'No records'],
      ['Admins', admins.map(a=>`${a.name} (${a.email})`).join('<br>')||'No records']
    ].map(([h,c])=>`<h2>${h}</h2><div>${c}</div>`).join('');
    printHtml('All Data', html);
  };

  const importJson = async (e) => {
    const file = e.target.files[0]; if(!file) return; const r=new FileReader(); r.onload=async ()=>{
      try { const data = JSON.parse(r.result); setLoading(true);
        // Naive import: only create (no update) skipping duplicates by key where possible
        const createIf = async (arr, existing, key, creator) => { for(const item of arr||[]) { if(existing.some(x=>x[key]===item[key])) continue; await creator(item); } };
        await createIf(data.students, students, 'roll', d=> adminCreateStudent(d));
        await createIf(data.faculty, faculty, 'fid', d=> adminCreateFaculty(d));
        await createIf(data.parents, parents, 'pid', d=> adminCreateParent(d));
        await createIf(data.departments, departments, 'name', d=> adminCreateDepartment(d));
        await createIf(data.attendance, attendance, '_id', d=> adminCreateAttendance({ studentRoll:d.studentRoll||d.roll, date:d.date, status:d.status }));
        await createIf(data.exams, exams, '_id', d=> adminCreateExam({ roll:d.roll, subject:d.subject, examName:d.examName, marks:d.marks }));
        await createIf(data.fees, fees, '_id', d=> adminCreateFee(d));
        alert('Import complete'); loadAll();
      } catch(err){ alert('Invalid file'); }
      finally { setLoading(false); }
    }; r.readAsText(file); e.target.value='';
  };

  if(!isAdmin) return <div className='p-8 text-center'>Access denied.</div>;

  const filtered = {
    students: students.filter(s=> (s.name||'').toLowerCase().includes(qStudent.toLowerCase()) || (s.roll||'').toLowerCase().includes(qStudent.toLowerCase()) ),
    faculty: faculty.filter(f=> (f.name||'').toLowerCase().includes(qFaculty.toLowerCase()) || (f.fid||'').toLowerCase().includes(qFaculty.toLowerCase()) ),
    parents: parents.filter((p) => {
      const query = qParent.toLowerCase();
      const linked = extractStudentIdentifier(p.linkedStudent).toLowerCase();
      return (p.name||'').toLowerCase().includes(query) || (p.pid||'').toLowerCase().includes(query) || linked.includes(query);
    }),
    departments: departments.filter(d=> (d.name||'').toLowerCase().includes(qDept.toLowerCase()) ),
    attendance: attendance.filter(a=> (a.studentRoll||'').toLowerCase().includes(qAtt.toLowerCase()) || (a.date||'').includes(qAtt) ),
    exams: exams.filter(x=> (x.roll||'').toLowerCase().includes(qExam.toLowerCase()) || (x.subject||'').toLowerCase().includes(qExam.toLowerCase()) || (x.examName||'').toLowerCase().includes(qExam.toLowerCase()) ),
    fees: fees.filter(f=> (f.roll||'').toLowerCase().includes(qExam.toLowerCase()) ),
    admins: admins.filter(a=> (a.name||'').toLowerCase().includes(qAdmin.toLowerCase()) || (a.email||'').toLowerCase().includes(qAdmin.toLowerCase()))
  };

  const printSection = (id,title) => {
    const root = document.getElementById(id); if(!root) return alert('Nothing to print');
    printHtml(title, root.innerHTML);
  };

  return (
    <div className='admin-panel min-h-screen bg-gray-100'>
      <nav className='bg-purple-700 text-white px-6 py-4 flex justify-between items-center'>
        <h1 className='text-xl font-bold'>Admin Panel v4.2</h1>
        <div className='flex gap-2 items-center'>
          <button onClick={exportAll} className='bg-blue-500 px-3 py-1 rounded'>Export JSON</button>
          <label className='bg-green-600 px-3 py-1 rounded cursor-pointer'>Import<input id='import-data-file' name='importDataFile' type='file' className='hidden' onChange={importJson} /></label>
          <button onClick={printAll} className='bg-yellow-500 px-3 py-1 rounded'>🖨 Print All</button>
          <button onClick={exportAll} className='bg-orange-500 px-3 py-1 rounded'>📦 Export All</button>
        </div>
      </nav>

      <div className='flex'>
        <aside className='w-72 min-h-screen bg-gray-800 text-white p-4 space-y-2'>
          {['students','faculty','parents','departments','attendance','exams','fees','admins'].map(k=>
            <button key={k} onClick={()=>setActive(k)} className={`w-full text-left p-2 rounded ${active===k?'bg-purple-600':'hover:bg-gray-700'}`}>{k.charAt(0).toUpperCase()+k.slice(1)}</button>
          )}
        </aside>
        <main className='flex-1 p-6 space-y-10'>
          {error && <div className='bg-red-100 text-red-700 p-3 rounded'>{error}</div>}
          {loading && <div className='text-sm text-gray-600'>Loading...</div>}

          <Section id='students' isActive={active==='students'}>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-bold'>Students</h2>
              <div><button onClick={()=>printSection('studentList','Students')} className='bg-gray-600 text-white px-3 py-1 rounded'>Print</button></div>
            </div>
            <form onSubmit={submitStudent} className='grid grid-cols-2 gap-3 bg-white p-4 rounded shadow'>
              <input
                id='student-name'
                name='studentName'
                value={studentForm.name}
                onChange={onStudentNameChange}
                placeholder='Full Name'
                className='border p-2 rounded'
                required
              />
              <input id='student-roll' name='studentRoll' value={studentForm.roll} onChange={onStudentRollChange} placeholder='Roll (unique)' className='border p-2 rounded' disabled={!!edit.student} required />
              <input id='student-email' name='studentEmail' value={studentForm.email} onChange={onStudentEmailChange} placeholder='Email' className='border p-2 rounded' />
              <input id='student-phone' name='studentPhone' value={studentForm.phone} onChange={onStudentPhoneChange} placeholder='Phone' className='border p-2 rounded' />
              <input id='student-dob' name='studentDob' value={studentForm.dob} onChange={onStudentDobChange} type='date' className='border p-2 rounded' />
              <select id='student-gender' name='studentGender' value={studentForm.gender} onChange={onStudentGenderChange} className='border p-2 rounded'>
                {genderOptions.map(opt => <option key={opt || 'blank'} value={opt}>{opt || 'Select gender'}</option>)}
              </select>
              <input id='student-address' name='studentAddress' value={studentForm.address} onChange={onStudentAddressChange} placeholder='Address' className='border p-2 rounded col-span-2' />
              <input id='student-dept' name='studentDeptId' value={studentForm.deptId} onChange={onStudentDeptChange} placeholder='DeptId' className='border p-2 rounded' />
              <input id='student-parent' name='studentParentId' value={studentForm.parentId} onChange={onStudentParentChange} placeholder='ParentId' className='border p-2 rounded' />
              <input id='student-username' name='studentUsername' value={studentForm.username} onChange={onStudentUsernameChange} placeholder='Login username (optional)' className='border p-2 rounded' />
              <input id='student-password' name='studentPassword' value={studentForm.password} onChange={onStudentPasswordChange} placeholder='Login password (optional)' type='password' className='border p-2 rounded' />
              <input id='student-file' name='studentFile' type='file' onChange={e=>updateStudentForm('file',e.target.files[0])} className='border p-2 rounded col-span-2' />
              <button className='col-span-2 bg-purple-600 text-white py-2 rounded'>{edit.student? 'Update Student':'Save Student'}</button>
            </form>
            <input id='student-search' name='studentSearch' value={qStudent} onChange={e=>setQStudent(e.target.value)} placeholder='Search by name, roll' className='mt-4 p-2 border rounded w-full' />
            <ul id='studentList' className='mt-4 space-y-2'>
              {filtered.students.map(s=> (
                <li key={s._id} className='bg-white p-3 flex justify-between rounded'>
                  <div><strong>{s.name}</strong> <span className='text-sm text-gray-600'>({s.roll})</span><div className='text-xs text-gray-500'>{s.email||'—'} • {s.phone||'—'}</div></div>
                  <div className='flex gap-2 items-center'>
                    <button onClick={()=>startEditStudent(s)} className='bg-blue-500 text-white px-2 py-1 rounded text-sm'>Edit</button>
                    <button onClick={()=>deleteStudent(s._id)} className='bg-red-500 text-white px-2 py-1 rounded text-sm'>Delete</button>
                  </div>
                </li>
              ))}
              {filtered.students.length===0 && <li className='text-sm text-gray-500'>No students.</li>}
            </ul>
          </Section>

          <Section id='faculty' isActive={active==='faculty'}>
            <div className='flex justify-between items-center'><h2 className='text-xl font-bold'>Faculty</h2><div><button onClick={()=>printSection('facultyList','Faculty')} className='bg-gray-600 text-white px-3 py-1 rounded'>Print</button></div></div>
            <form onSubmit={submitFaculty} className='grid grid-cols-2 gap-3 bg-white p-4 rounded shadow'>
              <input id='faculty-name' name='facultyName' value={facultyForm.name} onChange={onFacultyNameChange} placeholder='Full Name' className='border p-2 rounded' required />
              <input id='faculty-id' name='facultyId' value={facultyForm.fid} onChange={onFacultyFidChange} placeholder='Faculty ID (unique)' className='border p-2 rounded' disabled={!!edit.faculty} required />
              <input id='faculty-email' name='facultyEmail' value={facultyForm.email} onChange={onFacultyEmailChange} placeholder='Email' className='border p-2 rounded' />
              <input id='faculty-phone' name='facultyPhone' value={facultyForm.phone} onChange={onFacultyPhoneChange} placeholder='Phone' className='border p-2 rounded' />
              <input id='faculty-dob' name='facultyDob' value={facultyForm.dob} onChange={onFacultyDobChange} type='date' className='border p-2 rounded' />
              <select id='faculty-gender' name='facultyGender' value={facultyForm.gender} onChange={onFacultyGenderChange} className='border p-2 rounded'>
                {genderOptions.map(opt => <option key={`fac-${opt || 'blank'}`} value={opt}>{opt || 'Select gender'}</option>)}
              </select>
              <input id='faculty-address' name='facultyAddress' value={facultyForm.address} onChange={onFacultyAddressChange} placeholder='Address' className='border p-2 rounded col-span-2' />
              <input id='faculty-dept' name='facultyDeptId' value={facultyForm.deptId} onChange={onFacultyDeptChange} placeholder='DeptId' className='border p-2 rounded' />
              <input id='faculty-salary' name='facultySalary' value={facultyForm.salary} onChange={onFacultySalaryChange} placeholder='Salary' type='number' className='border p-2 rounded' />
              <input id='faculty-username' name='facultyUsername' value={facultyForm.username} onChange={onFacultyUsernameChange} placeholder='Login username (optional)' className='border p-2 rounded' />
              <input id='faculty-password' name='facultyPassword' value={facultyForm.password} onChange={onFacultyPasswordChange} placeholder='Login password (optional)' type='password' className='border p-2 rounded' />
              <button className='col-span-2 bg-purple-600 text-white py-2 rounded'>{edit.faculty? 'Update Faculty':'Save Faculty'}</button>
            </form>
            <input id='faculty-search' name='facultySearch' value={qFaculty} onChange={e=>setQFaculty(e.target.value)} placeholder='Search by name, id' className='mt-4 p-2 border rounded w-full' />
            <ul id='facultyList' className='mt-4 space-y-2'>
              {filtered.faculty.map(f=> (
                <li key={f._id} className='bg-white p-3 flex justify-between rounded'>
                  <div><strong>{f.name}</strong> <span className='text-sm text-gray-600'>({f.fid})</span></div>
                  <div className='flex gap-2 items-center'>
                    <button onClick={()=>startEditFaculty(f)} className='bg-blue-500 text-white px-2 py-1 rounded text-sm'>Edit</button>
                    <button onClick={()=>deleteFaculty(f._id)} className='bg-red-500 text-white px-2 py-1 rounded text-sm'>Delete</button>
                  </div>
                </li>
              ))}
              {filtered.faculty.length===0 && <li className='text-sm text-gray-500'>No faculty.</li>}
            </ul>
          </Section>

          <Section id='parents' isActive={active==='parents'}>
            <div className='flex justify-between items-center'><h2 className='text-xl font-bold'>Parents</h2><div><button onClick={()=>printSection('parentList','Parents')} className='bg-gray-600 text-white px-3 py-1 rounded'>Print</button></div></div>
            <form onSubmit={submitParent} className='grid grid-cols-2 gap-3 bg-white p-4 rounded shadow'>
              <input id='parent-name' name='parentName' value={parentForm.name} onChange={onParentNameChange} placeholder='Parent Name' className='border p-2 rounded' required />
              <input id='parent-id' name='parentId' value={parentForm.pid} onChange={onParentPidChange} placeholder='Parent ID (unique)' className='border p-2 rounded' disabled={!!edit.parent} required />
              <input id='parent-email' name='parentEmail' value={parentForm.email} onChange={onParentEmailChange} placeholder='Email' className='border p-2 rounded' />
              <input id='parent-phone' name='parentPhone' value={parentForm.phone} onChange={onParentPhoneChange} placeholder='Phone' className='border p-2 rounded' />
              <input id='parent-address' name='parentAddress' value={parentForm.address} onChange={onParentAddressChange} placeholder='Address' className='border p-2 rounded col-span-2' />
              <input id='parent-linked-student' name='linkedStudentId' value={parentForm.linkedStudent} onChange={onParentLinkedChange} placeholder='Linked Student ID' className='border p-2 rounded' />
              <input id='parent-username' name='parentUsername' value={parentForm.username} onChange={onParentUsernameChange} placeholder='Login username (optional)' className='border p-2 rounded' />
              <input id='parent-password' name='parentPassword' value={parentForm.password} onChange={onParentPasswordChange} placeholder='Login password (optional)' type='password' className='border p-2 rounded' />
              <button className='col-span-2 bg-purple-600 text-white py-2 rounded'>{edit.parent? 'Update Parent':'Save Parent'}</button>
            </form>
            <input id='parent-search' name='parentSearch' value={qParent} onChange={e=>setQParent(e.target.value)} placeholder='Search by name, id, student' className='mt-4 p-2 border rounded w-full' />
            <ul id='parentList' className='mt-4 space-y-2'>
              {filtered.parents.map(p=> (
                <li key={p._id} className='bg-white p-3 flex justify-between rounded'>
                  <div>
                    <strong>{p.name}</strong> <span className='text-sm text-gray-600'>({p.pid})</span>
                    <div className='text-xs text-gray-500'>
                      Linked: {formatLinkedStudentLabel(p.linkedStudent) || '—'}
                    </div>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <button onClick={()=>startEditParent(p)} className='bg-blue-500 text-white px-2 py-1 rounded text-sm'>Edit</button>
                    <button onClick={()=>deleteParent(p._id)} className='bg-red-500 text-white px-2 py-1 rounded text-sm'>Delete</button>
                  </div>
                </li>
              ))}
              {filtered.parents.length===0 && <li className='text-sm text-gray-500'>No parents.</li>}
            </ul>
          </Section>

          <Section id='departments' isActive={active==='departments'}>
            <div className='flex justify-between items-center'><h2 className='text-xl font-bold'>Departments</h2><div><button onClick={()=>printSection('deptList','Departments')} className='bg-gray-600 text-white px-3 py-1 rounded'>Print</button></div></div>
            <form onSubmit={submitDept} className='flex gap-2 bg-white p-4 rounded shadow'>
              <input id='dept-name' name='deptName' value={deptForm.name} onChange={onDeptNameChange} placeholder='Department Name' className='border p-2 rounded flex-1' required />
              <input id='dept-hod' name='deptHod' value={deptForm.hod} onChange={onDeptHodChange} placeholder='HOD FacultyId (optional)' className='border p-2 rounded' />
              <button className='bg-purple-600 text-white px-4 rounded'>{edit.dept? 'Update Dept':'Save Dept'}</button>
            </form>
            <input id='department-search' name='departmentSearch' value={qDept} onChange={e=>setQDept(e.target.value)} placeholder='Search departments' className='mt-4 p-2 border rounded w-full' />
            <ul id='deptList' className='mt-4 space-y-2'>
              {filtered.departments.map(d=> (
                <li key={d._id} className='bg-white p-3 flex justify-between rounded'>
                  <div><strong>{d.name}</strong></div>
                  <div className='flex gap-2 items-center'>
                    <button onClick={()=>startEditDept(d)} className='bg-blue-500 text-white px-2 py-1 rounded text-sm'>Edit</button>
                    <button onClick={()=>deleteDept(d._id)} className='bg-red-500 text-white px-2 py-1 rounded text-sm'>Delete</button>
                  </div>
                </li>
              ))}
              {filtered.departments.length===0 && <li className='text-sm text-gray-500'>No departments.</li>}
            </ul>
          </Section>

          <Section id='attendance' isActive={active==='attendance'}>
            <h2 className='text-xl font-bold mb-4'>Attendance</h2>
            <form onSubmit={submitAtt} className='grid grid-cols-3 gap-3 bg-white p-4 rounded shadow'>
              <input id='attendance-roll' name='attendanceRoll' value={attForm.studentRoll} onChange={onAttStudentRollChange} placeholder='Student Roll' className='border p-2 rounded' required />
              <input id='attendance-date' name='attendanceDate' value={attForm.date} onChange={onAttDateChange} type='date' className='border p-2 rounded' required />
              <select id='attendance-status' name='attendanceStatus' value={attForm.status} onChange={onAttStatusChange} className='border p-2 rounded'>
                {['Present','Absent'].map(opt => <option key={`att-${opt}`} value={opt}>{opt}</option>)}
              </select>
              <button className='col-span-3 bg-purple-600 text-white py-2 rounded'>{edit.att? 'Update Attendance':'Save Attendance'}</button>
            </form>
            <input id='attendance-search' name='attendanceSearch' value={qAtt} onChange={e=>setQAtt(e.target.value)} placeholder='Filter by roll/date' className='mt-4 p-2 border rounded w-full' />
            <ul id='attList' className='mt-4 space-y-2'>
              {filtered.attendance.map(a=> (
                <li key={a._id} className='bg-white p-3 flex justify-between rounded'>
                  <div>{a.studentRoll} - {new Date(a.date).toLocaleDateString()} : {a.status}</div>
                  <div className='flex gap-2 items-center'>
                    <button onClick={()=>startEditAtt(a)} className='bg-blue-500 text-white px-2 py-1 rounded text-sm'>Edit</button>
                    <button onClick={()=>deleteAtt(a._id)} className='bg-red-500 text-white px-2 py-1 rounded text-sm'>Delete</button>
                  </div>
                </li>
              ))}
              {filtered.attendance.length===0 && <li className='text-sm text-gray-500'>No attendance.</li>}
            </ul>
          </Section>

          <Section id='exams' isActive={active==='exams'}>
            <h2 className='text-xl font-bold mb-4'>Exams</h2>
            <form onSubmit={submitExam} className='grid grid-cols-4 gap-3 bg-white p-4 rounded shadow'>
              <input id='exam-roll' name='examRoll' value={examForm.roll} onChange={onExamRollChange} placeholder='Roll' className='border p-2 rounded' required />
              <input id='exam-subject' name='examSubject' value={examForm.subject} onChange={onExamSubjectChange} placeholder='Subject' className='border p-2 rounded' required />
              <input id='exam-name' name='examName' value={examForm.examName} onChange={onExamNameChange} placeholder='Exam Name' className='border p-2 rounded' required />
              <input id='exam-marks' name='examMarks' value={examForm.marks} onChange={onExamMarksChange} type='number' placeholder='Marks' className='border p-2 rounded' required />
              <button className='col-span-4 bg-purple-600 text-white py-2 rounded'>{edit.exam? 'Update Exam':'Save Exam'}</button>
            </form>
            <input id='exam-search' name='examSearch' value={qExam} onChange={e=>setQExam(e.target.value)} placeholder='Search exams' className='mt-4 p-2 border rounded w-full' />
            <ul id='examList' className='mt-4 space-y-2'>
              {filtered.exams.map(x=> (
                <li key={x._id} className='bg-white p-3 flex justify-between rounded'>
                  <div>{x.roll} - {x.examName} ({x.subject}) : {x.marks}</div>
                  <div className='flex gap-2 items-center'>
                    <button onClick={()=>startEditExam(x)} className='bg-blue-500 text-white px-2 py-1 rounded text-sm'>Edit</button>
                    <button onClick={()=>deleteExam(x._id)} className='bg-red-500 text-white px-2 py-1 rounded text-sm'>Delete</button>
                  </div>
                </li>
              ))}
              {filtered.exams.length===0 && <li className='text-sm text-gray-500'>No exams.</li>}
            </ul>
          </Section>

          <Section id='fees' isActive={active==='fees'}>
            <h2 className='text-xl font-bold mb-4'>Fees</h2>
            <form onSubmit={submitFee} className='grid grid-cols-3 gap-3 bg-white p-4 rounded shadow'>
              <input id='fee-roll' name='feeRoll' value={feeForm.roll} onChange={onFeeRollChange} placeholder='Roll' className='border p-2 rounded' required />
              <input id='fee-total' name='feeTotal' value={feeForm.total} onChange={onFeeTotalChange} type='number' placeholder='Total Fee' className='border p-2 rounded' required />
              <input id='fee-paid' name='feePaid' value={feeForm.paid} onChange={onFeePaidChange} type='number' placeholder='Paid Fee' className='border p-2 rounded' required />
              <button className='col-span-3 bg-purple-600 text-white py-2 rounded'>{edit.fee? 'Update Fee':'Save Fee'}</button>
            </form>
            <ul id='feeList' className='mt-4 space-y-2'>
              {fees.map(f=> (
                <li key={f._id} className='bg-white p-3 flex justify-between rounded'>
                  <div>{f.roll} - Paid: {f.paid}/{f.total}</div>
                  <div className='flex gap-2 items-center'>
                    <button onClick={()=>startEditFee(f)} className='bg-blue-500 text-white px-2 py-1 rounded text-sm'>Edit</button>
                    <button onClick={()=>deleteFee(f._id)} className='bg-red-500 text-white px-2 py-1 rounded text-sm'>Delete</button>
                  </div>
                </li>
              ))}
              {fees.length===0 && <li className='text-sm text-gray-500'>No fees.</li>}
            </ul>
          </Section>

          <Section id='admins' isActive={active==='admins'}>
            <h2 className='text-xl font-bold mb-4'>Admins</h2>
            <form onSubmit={submitAdmin} className='grid grid-cols-3 gap-3 bg-white p-4 rounded shadow'>
              <input id='admin-name' name='adminName' value={adminForm.name} onChange={onAdminNameChange} placeholder='Name' className='border p-2 rounded' required />
              <input id='admin-email' name='adminEmail' value={adminForm.email} onChange={onAdminEmailChange} placeholder='Email (unique)' className='border p-2 rounded' required />
              <input id='admin-password' name='adminPassword' value={adminForm.password} onChange={onAdminPasswordChange} placeholder='Password' type='password' className='border p-2 rounded' required />
              <button className='col-span-3 bg-purple-600 text-white py-2 rounded'>Add Admin</button>
            </form>
            <input id='admin-search' name='adminSearch' value={qAdmin} onChange={e=>setQAdmin(e.target.value)} placeholder='Search admins' className='mt-4 p-2 border rounded w-full' />
            <ul id='adminList' className='mt-4 space-y-2'>
              {filtered.admins.map(a=> (
                <li key={a._id} className='bg-white p-3 flex justify-between rounded'>
                  <div><strong>{a.name}</strong> <span className='text-sm text-gray-600'>({a.email})</span></div>
                  <div className='flex gap-2 items-center'>
                    <button disabled className='bg-blue-500 text-white px-2 py-1 rounded text-sm opacity-50 cursor-default'>Edit</button>
                    <button onClick={()=>deleteAdmin(a._id)} className='bg-red-500 text-white px-2 py-1 rounded text-sm'>Delete</button>
                  </div>
                </li>
              ))}
              {filtered.admins.length===0 && <li className='text-sm text-gray-500'>No admins.</li>}
            </ul>
          </Section>

        </main>
      </div>
    </div>
  );
};

export default AdminV4Panel;

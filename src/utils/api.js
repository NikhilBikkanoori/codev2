import axios from 'axios';

const DEFAULT_API_URL = 'http://localhost:5000/api';
const rawBaseUrl = process.env.REACT_APP_API_URL;

const normalizeBaseUrl = (value) => {
  if (!value) return DEFAULT_API_URL;
  if (!/^https?:\/\//i.test(value)) {
    console.warn(
      `REACT_APP_API_URL must start with http or https. Received "${value}". Falling back to ${DEFAULT_API_URL}.`
    );
    return DEFAULT_API_URL;
  }
  return value.replace(/\/$/, '');
};

export const API_BASE_URL = normalizeBaseUrl(rawBaseUrl);
console.log('API baseURL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// User endpoints
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);

// Session endpoints
export const getSessions = () => api.get('/sessions');
export const createSession = (data) => api.post('/sessions', data);
export const updateSession = (id, data) => api.put(`/sessions/${id}`, data);

// Admin endpoints
export const getUsers = () => api.get('/admin/users');
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getStats = () => api.get('/admin/stats');

export default api;
// --- Admin Data APIs ---
export const adminFetchStudents = () => api.get('/admin/data/students');
export const adminCreateStudent = (data) => api.post('/admin/data/students', data);
export const adminUpdateStudent = (id,data) => api.put(`/admin/data/students/${id}`, data);
export const adminDeleteStudent = (id) => api.delete(`/admin/data/students/${id}`);
export const adminImportStudentsCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/admin/data/students/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const adminFetchFaculty = () => api.get('/admin/data/faculty');
export const adminCreateFaculty = (data) => api.post('/admin/data/faculty', data);
export const adminUpdateFaculty = (id,data) => api.put(`/admin/data/faculty/${id}`, data);
export const adminDeleteFaculty = (id) => api.delete(`/admin/data/faculty/${id}`);
export const adminFetchParents = () => api.get('/admin/data/parents');
export const adminCreateParent = (data) => api.post('/admin/data/parents', data);
export const adminUpdateParent = (id,data) => api.put(`/admin/data/parents/${id}`, data);
export const adminDeleteParent = (id) => api.delete(`/admin/data/parents/${id}`);
export const adminFetchDepartments = () => api.get('/admin/data/departments');
export const adminCreateDepartment = (data) => api.post('/admin/data/departments', data);
export const adminUpdateDepartment = (id,data) => api.put(`/admin/data/departments/${id}`, data);
export const adminDeleteDepartment = (id) => api.delete(`/admin/data/departments/${id}`);
export const adminFetchAttendance = () => api.get('/admin/data/attendance');
export const adminCreateAttendance = (data) => api.post('/admin/data/attendance', data);
export const adminUpdateAttendance = (id,data) => api.put(`/admin/data/attendance/${id}`, data);
export const adminDeleteAttendance = (id) => api.delete(`/admin/data/attendance/${id}`);
export const adminFetchExams = () => api.get('/admin/data/exams');
export const adminCreateExam = (data) => api.post('/admin/data/exams', data);
export const adminUpdateExam = (id,data) => api.put(`/admin/data/exams/${id}`, data);
export const adminDeleteExam = (id) => api.delete(`/admin/data/exams/${id}`);
export const adminFetchFees = () => api.get('/admin/data/fees');
export const adminCreateFee = (data) => api.post('/admin/data/fees', data);
export const adminUpdateFee = (id,data) => api.put(`/admin/data/fees/${id}`, data);
export const adminDeleteFee = (id) => api.delete(`/admin/data/fees/${id}`);
export const adminExportAll = () => api.get('/admin/data/export/all');
// Admin users management
export const adminCreateAdmin = (data) => api.post('/admin/data/admins', data);
export const adminDeleteAdmin = (id) => api.delete(`/admin/data/admins/${id}`);

// --- Student Dashboard APIs ---
export const studentFetchProfile = () => api.get('/students/me');
export const studentFetchAttendance = () => api.get('/students/me/attendance');
export const studentFetchExams = () => api.get('/students/me/exams');
export const studentFetchFees = () => api.get('/students/me/fees');

// --- Mentor Dashboard APIs ---
export const mentorFetchProfile = () => api.get('/mentors/me');
export const mentorFetchAssignedStudents = () => api.get('/mentors/me/students');
export const mentorFetchStudentDetails = (roll) => api.get(`/mentors/me/students/${roll}`);
export const mentorFetchStats = () => api.get('/mentors/me/stats');

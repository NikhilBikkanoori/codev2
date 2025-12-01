import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import StudentLogin from '../pages/StudentLogin';
import MentorLogin from '../pages/MentorLogin';
import ParentLogin from '../pages/ParentLogin';
import Dashboard from '../pages/Dashboard';
import MentorDashboard from '../pages/MentorDashboard';
import ParentDashboard from '../pages/ParentDashboard';
import AdminLogin from '../pages/AdminLogin';
import AdminV4Login from '../pages/AdminV4Login';
import AdminV4Panel from '../pages/AdminV4Panel';
import NewAdmin from '../pages/NewAdmin';
import Counseling from '../pages/Counseling';
import StudentProfile from '../pages/studentProfile';
import MentorProfile from '../pages/MentorProfile';
import StudentsData from '../pages/StudentsData';
import VerifyDataSource from '../pages/VerifyDataSource';
import DataSourceInfo from '../pages/DataSourceInfo';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/mentor-login" element={<MentorLogin />} />
      <Route path="/parent-login" element={<ParentLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/counseling" element={<Counseling />} />
      <Route path="/mentor-dashboard" element={<MentorDashboard />} />
      <Route path="/parent-dashboard" element={<ParentDashboard />} />
      {/* Updated to use the new v4 panel for /admin */}
      <Route path="/admin" element={<AdminV4Panel />} />
      <Route path="/newadmin" element={<NewAdmin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-v4-login" element={<AdminV4Login />} />
      {/* Keep legacy explicit path if needed */}
      <Route path="/admin-v4" element={<AdminV4Panel />} />
      <Route path="/StudentProfile" element={<StudentProfile />} />
      <Route path="/MentorProfile" element={<MentorProfile />} />
      <Route path="/students-data" element={<StudentsData />} />
      <Route path="/verify-data-source" element={<VerifyDataSource />} />
      <Route path="/data-source-info" element={<DataSourceInfo />} />
    </Routes>
  );
}

export default AppRoutes;
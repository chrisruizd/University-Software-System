// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import 'bootstrap/dist/css/bootstrap.min.css';


import StudentDashboard from './dashboards/StudentDashboard';
import AdvisorDashboard from './dashboards/AdvisorDashboard';
import StaffDashboard from './dashboards/StaffDashboard';
import InstructorDashboard from './dashboards/InstructorDashboard';
import SystemAdminDashboard from './dashboards/SystemAdminDashboard';

import EditStudent from './views/EditStudent';
import EditInstructor from './views/EditInstructor';
import EditAdvisor from './views/EditAdvisor';
import EditDepartment from './views/EditDepartment';
import EditCourse from './views/EditCourse';

import GPAWhatIfAnalysis from './components/GPAWhatIfAnalysis';

import AdvisorGPAWhatIf from './pages/AdvisorGPACalc';
import StudentGPAWhatIf from './pages/StudentGPACalc';

import SystemSummaryReports from './summaryReports/SystemSummaryReports';
import GPAByMajor from './summaryReports/GPAByMajor';
import DepartmentByGPA from './summaryReports/DepartmentByGPA';
import CoursesGradesBySemester from './summaryReports/CoursesGradesBySemester';
import InstructorCoursesByMajor from './summaryReports/InstructorCoursesByMajor';
import StudentsByMajorsCredits from './summaryReports/StudentsByMajorsCredits';

function App() {
  const role = localStorage.getItem('role'); // Retrieve the user's role from local storage

  const getDefaultPath = () => {
    const role = localStorage.getItem('role');
    if (role === 'student') return '/student-dashboard';
    if (role === 'advisor') return '/advisor-dashboard';
    if (role === 'staff') return '/staff-dashboard';
    if (role === 'instructor') return '/instructor-dashboard';
    if (role === 'system_admin') return '/admin-dashboard';
    return '/login'; // Default to login if role is not found
  };
  

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to={getDefaultPath()} replace />} />


        <Route path="/login" element={<Login />} />
        <Route path="/what-if-calc" element={<GPAWhatIfAnalysis />} />
        <Route path="/student-gpa-what-if" element={<StudentGPAWhatIf />} />
        <Route path="/advisor-gpa-what-if" element={<AdvisorGPAWhatIf />} />

        <Route path="/system-reports" element={<SystemSummaryReports />} />
        <Route path="/gpa-by-major" element={<GPAByMajor />} />
        <Route path="/department-by-GPA" element={<DepartmentByGPA />} />
        <Route path="/courses-grades-by-semester" element={<CoursesGradesBySemester />} />
        <Route path="/instructor-courses-by-major" element={<InstructorCoursesByMajor />} />
        <Route path="/students-by-majors-credits" element={<StudentsByMajorsCredits />} />

        {/* Protected routes for each dashboard */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/advisor-dashboard" element={<AdvisorDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
        <Route
          path="/admin-dashboard"
          element={
            role === 'system_admin' ? <SystemAdminDashboard /> : <Navigate to="/login" />
          }
        />


        {/*Staff actions*/}
        <Route path="/staff/edit-student" element={<EditStudent />} />
        <Route path="/staff/edit-instructor" element={<EditInstructor />} />
        <Route path="/staff/edit-course" element={<EditCourse />} />
        <Route path="/staff/edit-advisor" element={<EditAdvisor />} />
        <Route path="/staff/edit-department" element={<EditDepartment />} />
        
      </Routes>
    </Router>
  );
}

export default App;

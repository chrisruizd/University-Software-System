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

function App() {
  const role = localStorage.getItem('role'); // Retrieve the user's role from local storage

  return (
    <Router>
      <Routes>
        {/* Redirect based on role, login is default route */}
        <Route path="/" element={role ? <Navigate to={`/${role}-dashboard`} replace /> : <Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/what-if-calc" element={<GPAWhatIfAnalysis />} />
        <Route path="/student-gpa-what-if" element={<StudentGPAWhatIf />} />
        <Route path="/advisor-gpa-what-if" element={<AdvisorGPAWhatIf />} />

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

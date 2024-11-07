// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';

import StudentDashboard from './dashboards/StudentDashboard';
import AdvisorDashboard from './dashboards/AdvisorDashboard';
import StaffDashboard from './dashboards/StaffDashboard';
import InstructorDashboard from './dashboards/InstructorDashboard';


function App() {
  const role = localStorage.getItem('role'); // Retrieve the user's role from local storage

  return (
    <Router>
      <Routes>
        {/* Redirect based on role, login is default route */}
        <Route path="/" element={role ? <Navigate to={`/${role}-dashboard`} replace /> : <Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        {/* Protected routes for each dashboard */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/advisor-dashboard" element={<AdvisorDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;

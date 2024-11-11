// src/dashboards/StaffDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function StaffDashboard() {
  const navigate = useNavigate();
  const [staffInfo, setStaffInfo] = useState({});
  const email = localStorage.getItem('email'); // Retrieve stored email

  useEffect(() => {
    const fetchStaffInfo = async () => {
      try {
        const response = await api.get(`/staff-info`, { params: { email } });
        setStaffInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch staff info:", error);
      }
    };

    fetchStaffInfo();
  }, [email]);

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('token'); // If you are storing a token
    window.location.href = '/login';
  };

  return (
    <div>
      <h2>Staff Dashboard</h2>
      {staffInfo ? (
        <>
          <div>
            <p>Welcome, {staffInfo.firstname} {staffInfo.lastname}</p>
            <p>Email: {staffInfo.email}</p>
            <p>Department ID: {staffInfo.departmentid}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <br></br>
          <div>
            <button onClick={() => navigate('/staff/edit-student')}>View/Edit a Student</button>
            <button onClick={() => navigate('/staff/edit-instructor')}>View/Edit an Instructor</button>
            <button onClick={() => navigate('/staff/edit-course')}>View/Edit a Course</button>
            <button onClick={() => navigate('/staff/edit-advisor')}>View/Edit an Advisor</button>
            <button onClick={() => navigate('/staff/edit-department')}>View/Edit a Department</button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default StaffDashboard;

// src/dashboards/InstructorDashboard.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

function InstructorDashboard() {
  const [instructorInfo, setInstructorInfo] = useState({});
  const email = localStorage.getItem('email'); // Retrieve stored email

  useEffect(() => {
    const fetchInstructorInfo = async () => {
      try {
        const response = await api.get(`/instructor-info`, { params: { email } });
        setInstructorInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch instructor info:", error);
      }
    };

    fetchInstructorInfo();
  }, [email]);

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('token'); // If you are storing a token
    window.location.href = '/login';
  };

  return (
    <div>
      <h2>Instructor Dashboard</h2>
      {instructorInfo ? (
        <>
          <p>Welcome, {instructorInfo.firstname} {instructorInfo.lastname}</p>
          <p>Email: {instructorInfo.email}</p>
          <p>Department ID: {instructorInfo.departmentid}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default InstructorDashboard;

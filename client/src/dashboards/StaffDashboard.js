// src/dashboards/StaffDashboard.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

function StaffDashboard() {
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
          <p>Welcome, {staffInfo.firstname} {staffInfo.lastname}</p>
          <p>Email: {staffInfo.email}</p>
          <p>Department ID: {staffInfo.departmentid}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default StaffDashboard;

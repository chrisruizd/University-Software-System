// src/dashboards/AdvisorDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdvisorDashboard() {
  const [advisorInfo, setAdvisorInfo] = useState({});
  const email = localStorage.getItem('email'); // Retrieve stored email
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdvisorInfo = async () => {
      try {
        const response = await api.get(`/advisor-info`, { params: { email } });
        setAdvisorInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch advisor info:", error);
      }
    };

    fetchAdvisorInfo();
  }, [email]);

    // Logout function
    const handleLogout = () => {
        // Clear stored user data
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        localStorage.removeItem('token'); // Optional, only if you are using JWT

        // Redirect to login page
        navigate('/login');
    };

  return (
    <div>
      <h2>Advisor Dashboard</h2>
      <p>Welcome, {advisorInfo.firstname} {advisorInfo.lastname}</p>
      <p>Email: {advisorInfo.email}</p>
      <button onClick={handleLogout}>Logout</button>
      {/* Add other role-specific details as needed */}
    </div>
  );
}

export default AdvisorDashboard;

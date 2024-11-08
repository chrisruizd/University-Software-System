import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function StudentDashboard() {
  const [studentInfo, setStudentInfo] = useState({});
  const email = localStorage.getItem('email'); // Retrieve the email from localStorage
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await api.get(`/student-info`, { params: { email } });
        setStudentInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch student info:", error);
      }
    };

    fetchStudentInfo();
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
      <h2>Student Dashboard</h2>
      {studentInfo ? (
        <>
          <p>Welcome, {studentInfo.firstname} {studentInfo.lastname}</p>
          <p>Email: {studentInfo.email}</p>
          <p>Major: {studentInfo.majorin}</p>
          <p>GPA: {studentInfo.gpa}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default StudentDashboard;

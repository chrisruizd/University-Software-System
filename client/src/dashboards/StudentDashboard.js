// src/dashboards/StudentDashboard.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

function StudentDashboard() {
  const [studentInfo, setStudentInfo] = useState({});

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await api.get('/student-info'); // Adjust the endpoint as needed
        setStudentInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch student info:", error);
      }
    };

    fetchStudentInfo();
  }, []);

  return (
    <div>
      <h2>Student Dashboard</h2>
      <p>Welcome, {studentInfo.firstName} {studentInfo.lastName}</p>
      <p>Email: {studentInfo.email}</p>
      <p>Major: {studentInfo.majorin}</p>
      <p>GPA: {studentInfo.gpa}</p>
      {/* Add more details as needed */}
    </div>
  );
}

export default StudentDashboard;

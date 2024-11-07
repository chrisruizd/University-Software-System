import React, { useEffect, useState } from 'react';
import api from '../services/api';

function StudentDashboard() {
  const [studentInfo, setStudentInfo] = useState({});
  const email = localStorage.getItem('email'); // Retrieve the email from localStorage

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

  return (
    <div>
      <h2>Student Dashboard</h2>
      <p>Welcome, {studentInfo.firstname} {studentInfo.lastname}</p>
      <p>Email: {studentInfo.email}</p>
      <p>Major: {studentInfo.majorin}</p>
      <p>GPA: {studentInfo.gpa}</p>
      {/* Add more details as needed */}
    </div>
  );
}

export default StudentDashboard;

// src/dashboards/AdvisorDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdvisorDashboard() {
  const [advisorInfo, setAdvisorInfo] = useState({});
  const [studentUID, setStudentUID] = useState('');
  const [studentCourses, setStudentCourses] = useState([]);
  const [newCRN, setNewCRN] = useState('');
  const [message, setMessage] = useState('');
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

  // Fetch student's current courses
  const fetchStudentCourses = async () => {
    try {
      const response = await api.get(`/student-courses/${studentUID}`);
      setStudentCourses(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Failed to fetch student courses');
    }
  };

  // Add a course for the student
  const addCourseForStudent = async () => {
    try {
      const response = await api.post(`/add-course`, {
        advisorEID: advisorInfo.eid, // Use advisor's EID from advisorInfo
        studentUID,
        crn: newCRN,
      });
      setMessage(response.data.message);
      fetchStudentCourses(); // Refresh the student's course list
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to add course');
    }
  };

  // Drop a course for the student
  const dropCourseForStudent = async (crn) => {
    try {
      const response = await api.post(`/drop-course`, {
        advisorEID: advisorInfo.eid, // Use advisor's EID from advisorInfo
        studentUID,
        crn,
      });
      setMessage(response.data.message);
      fetchStudentCourses(); // Refresh the student's course list
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to drop course');
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('token'); // Optional, only if you are using JWT
    navigate('/login');
  };

  return (
    <div>
      <h2>Advisor Dashboard</h2>
      <p>Welcome, {advisorInfo.firstname} {advisorInfo.lastname}</p>
      <p>Email: {advisorInfo.email}</p>
      
      <button onClick={handleLogout}>Logout</button>

      <h3>Manage Student Courses</h3>
      <div>
        <p>Enter Student UID to View Courses:</p>
        <input
          type="text"
          value={studentUID}
          onChange={(e) => setStudentUID(e.target.value)}
          placeholder="Enter Student UID"
        />
        <button onClick={fetchStudentCourses}>Fetch Courses</button>
      </div>

      {studentCourses.length > 0 && (
        <div>
          <h4>Current Courses for Student {studentUID}</h4>
          <ul>
            {studentCourses.map((course) => (
              <li key={course.crn}>
                <strong>{course.name}</strong> ({course.crn}) - {course.credits} credits<br />
                Semester: {course.semester}, Year: {course.year}<br />
                Grade: {course.completed ? course.grade : "In Progress"}<br />
                <button onClick={() => dropCourseForStudent(course.crn)}>Drop Course</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4>Add Course for Student</h4>
        <input
          type="text"
          value={newCRN}
          onChange={(e) => setNewCRN(e.target.value)}
          placeholder="Enter Course CRN"
        />
        <button onClick={addCourseForStudent}>Add Course</button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AdvisorDashboard;

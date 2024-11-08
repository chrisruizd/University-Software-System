import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function StudentDashboard() {
  const [studentInfo, setStudentInfo] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState([]);
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

    // Fetch student's enrolled courses
    const fetchEnrolledCourses = async () => {
      try {
        const response = await api.get(`/student-courses`, { params: { email } });
        setEnrolledCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
      }
    };

    fetchStudentInfo();
    fetchEnrolledCourses();
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
          <p>UID: {studentInfo.uid}</p>
          <p>GPA: {studentInfo.gpa}</p>
          <p>Credits: {studentInfo.credits}</p>
          <p>Advisor: {studentInfo.advised_by}</p>

          <h3>Enrolled Courses</h3>
          {enrolledCourses.length > 0 ? (
            <ul>
              {enrolledCourses.map((course) => (
                <li key={course.crn}>
                  <strong>{course.name}</strong> ({course.crn}) - {course.credits} credits<br />
                  Semester: {course.semester}, Year: {course.year}<br />
                  Start Time: {new Date(course.starttime).toLocaleString()}<br />
                  End Time: {new Date(course.endtime).toLocaleString()}<br />
                  Grade: {course.completed ? course.grade : "In Progress"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No enrolled courses found.</p>
          )}

          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default StudentDashboard;

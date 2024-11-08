// src/dashboards/InstructorDashboard.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

function InstructorDashboard() {
  const [instructorInfo, setInstructorInfo] = useState({});
  const [taughtCourses, setTaughtCourses] = useState([]);
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

    // Fetch courses taught by the instructor
    const fetchTaughtCourses = async () => {
        try {
          const response = await api.get(`/instructor-courses`, { params: { email } });
          setTaughtCourses(response.data);
        } catch (error) {
          console.error("Failed to fetch taught courses:", error);
        }
    };

    fetchInstructorInfo();
    fetchTaughtCourses();
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

          <h3>Courses Taught</h3>
            {taughtCourses.length > 0 ? (
                <ul>
                {taughtCourses.map((course) => (
                    <li key={course.crn}>
                    <strong>{course.name}</strong> ({course.crn}) - {course.credits} credits<br />
                    Semester: {course.semester}, Year: {course.year}<br />
                    Start Time: {new Date(course.starttime).toLocaleString()}<br />
                    End Time: {new Date(course.endtime).toLocaleString()}
                    </li>
                ))}
                </ul>
            ) : (
                <p>No courses assigned.</p>
            )}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default InstructorDashboard;

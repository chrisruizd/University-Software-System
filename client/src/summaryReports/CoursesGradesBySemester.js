// src/summaryReports/CoursesGradesBySemester.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function CoursesGradesBySemester() {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState([]);
  const [error, setError] = useState('');

  // Fetch course enrollments data from API
  const fetchCourseData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/course-enrollments');
      setCourseData(response.data);
    } catch (error) {
      console.error('Failed to fetch course data:', error);
      setError('Failed to load course enrollments data. Please try again later.');
    }
  };

  // Fetch data when the component loads
  useEffect(() => {
    fetchCourseData();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-start mb-4">
        <button className="btn btn-secondary" onClick={() => navigate('/system-reports')}>
          ← Back to System Summary Reports
        </button>
      </div>

      <h2 className="text-center mb-4">Course Enrollments and Average Grades by Semester</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Semester</th>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Total Enrollments</th>
              <th>Average Grade</th>
            </tr>
          </thead>
          <tbody>
            {courseData.length > 0 ? (
              courseData.map((row, index) => (
                <tr key={index}>
                  <td>{row.semester}</td>
                  <td>{row.courseid}</td>
                  <td>{row.coursename}</td>
                  <td>{row.totalenrollments}</td>
                  <td>{row.averagegrade}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CoursesGradesBySemester;

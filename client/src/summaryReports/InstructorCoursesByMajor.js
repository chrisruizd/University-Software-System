import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function InstructorCoursesByMajor() {
  const navigate = useNavigate();
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [error, setError] = useState('');

  // Fetch the instructor course enrollment data from the API
  const fetchEnrollmentData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/instructor-course-enrollment');
      setEnrollmentData(response.data);
    } catch (error) {
      console.error('Failed to fetch enrollment data:', error);
      setError('Failed to load instructor course enrollment data. Please try again later.');
    }
  };

  // Fetch data when the component loads
  useEffect(() => {
    fetchEnrollmentData();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-start mb-4">
        <button className="btn btn-secondary" onClick={() => navigate('/system-reports')}>
          ← Back to System Summary Reports
        </button>
      </div>

      <h2 className="text-center mb-4">Instructor Course Enrollment by Major</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Instructor ID</th>
              <th>Instructor Name</th>
              <th>Course Code</th>
              <th>Major</th>
              <th>Students</th>
            </tr>
          </thead>
          <tbody>
            {enrollmentData.length > 0 ? (
              enrollmentData.map((row, index) => (
                <tr key={index}>
                  <td>{row.instructorid}</td>
                  <td>{row.instructorname}</td>
                  <td>{row.coursecode}</td>
                  <td>{row.major}</td>
                  <td>{row.totalstudents}</td>
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

export default InstructorCoursesByMajor;

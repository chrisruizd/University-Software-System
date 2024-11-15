import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function StudentsByMajorsCredits() {
  const navigate = useNavigate();
  const [studentsData, setStudentsData] = useState([]);
  const [error, setError] = useState('');

  // Fetch the students data from the API
  const fetchStudentsData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/students-by-major-credits');
      setStudentsData(response.data);
    } catch (error) {
      console.error('Failed to fetch students data:', error);
      setError('Failed to load student data. Please try again later.');
    }
  };

  // Fetch data when the component loads
  useEffect(() => {
    fetchStudentsData();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-start mb-4">
        <button className="btn btn-secondary" onClick={() => navigate('/system-reports')}>
          ← Back to System Summary Reports
        </button>
      </div>

      <h2 className="text-center mb-4">All Students by Major and Total Credits</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Major</th>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Total Credits</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.length > 0 ? (
              studentsData.map((row, index) => (
                <tr key={index}>
                  <td>{row.major}</td>
                  <td>{row.studentid}</td>
                  <td>{row.studentname}</td>
                  <td>{row.totalcredits}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
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

export default StudentsByMajorsCredits;

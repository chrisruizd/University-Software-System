import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function DepartmentByGPA() {
  const navigate = useNavigate();
  const [departmentData, setDepartmentData] = useState([]);
  const [error, setError] = useState('');

  // Fetch department GPA data from the API
  const fetchDepartmentData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/department-rank-by-gpa');
      setDepartmentData(response.data);
    } catch (error) {
      console.error('Failed to fetch department data:', error);
      setError('Failed to load department GPA data. Please try again later.');
    }
  };

  // Fetch data when the component loads
  useEffect(() => {
    fetchDepartmentData();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-start mb-4">
        <button className="btn btn-secondary" onClick={() => navigate('/system-reports')}>
          ← Back to System Summary Reports
        </button>
      </div>

      <h2 className="text-center mb-4">Department Rank by Average GPA (Highest to Lowest)</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Rank</th>
              <th>Department</th>
              <th>Average GPA</th>
            </tr>
          </thead>
          <tbody>
            {departmentData.length > 0 ? (
              departmentData.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row.department}</td>
                  <td>{row.averagegpa}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
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

export default DepartmentByGPA;

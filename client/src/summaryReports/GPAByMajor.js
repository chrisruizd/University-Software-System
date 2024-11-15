import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function GPAByMajor() {
  const navigate = useNavigate();
  const [gpaData, setGpaData] = useState([]);
  const [error, setError] = useState('');

  // Fetch GPA statistics from the API
  const fetchGPAData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/gpa-by-major');
      setGpaData(response.data);
    } catch (error) {
      console.error('Failed to fetch GPA data:', error);
      setError('Failed to load GPA statistics. Please try again later.');
    }
  };

  // Fetch data when the component loads
  useEffect(() => {
    fetchGPAData();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-start mb-4">
        <button className="btn btn-secondary" onClick={() => navigate('/system-reports')}>
          ← Back to System Summary Reports
        </button>
      </div>

      <h2 className="text-center mb-4">GPA Statistics for each Major</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Major</th>
              <th>Highest GPA</th>
              <th>Lowest GPA</th>
              <th>Average GPA</th>
            </tr>
          </thead>
          <tbody>
            {gpaData.length > 0 ? (
              gpaData.map((row, index) => (
                <tr key={index}>
                  <td>{row.major}</td>
                  <td>{row.highestgpa}</td>
                  <td>{row.lowestgpa}</td>
                  <td>{row.averagegpa}</td>
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

export default GPAByMajor;

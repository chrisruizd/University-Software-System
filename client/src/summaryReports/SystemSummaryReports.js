import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function SystemSummaryReports() {
  const navigate = useNavigate();

  const buttonStyle = {
    fontSize: '15px', // Smaller font size
    padding: '10px 15px', // Adjust padding for better look
  };

  return (
    <div className="container mt-5">
      {/* Back Button to Admin Dashboard */}
      <div className="d-flex justify-content-start mb-4">
        <button className="btn btn-secondary" onClick={() => navigate('/admin-dashboard')}>
          ← Back to Admin Dashboard
        </button>
      </div>

      <h2 className="text-center mb-4">System Summary Reports</h2>
      <p className="text-center mb-4">Click to view:</p>

      <div className="d-grid gap-3">
        <button
          className="btn btn-dark text-white"
          style={buttonStyle}
          onClick={() => navigate('/gpa-by-major')}
        >
          GPA Statistics for each Major
        </button>
        <button
          className="btn btn-dark text-white"
          style={buttonStyle}
          onClick={() => navigate('/department-by-gpa')}
        >
          Department Rank by GPA
        </button>
        <button
          className="btn btn-dark text-white"
          style={buttonStyle}
          onClick={() => navigate('/courses-grades-by-semester')}
        >
          Course Enrollments and Average Grades by Semester
        </button>
        <button
          className="btn btn-dark text-white"
          style={buttonStyle}
          onClick={() => navigate('/instructor-courses-by-major')}
        >
          Instructor Course Enrollment by Major
        </button>
        <button
          className="btn btn-dark text-white"
          style={buttonStyle}
          onClick={() => navigate('/students-by-majors-credits')}
        >
          All Students by Major and Total Credits
        </button>
      </div>
    </div>
  );
}

export default SystemSummaryReports;

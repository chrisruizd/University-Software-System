import React from 'react';
import GPAWhatIfAnalysis from '../components/GPAWhatIfAnalysis';
import { useNavigate } from 'react-router-dom';

function StudentGPAWhatIf() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-start mb-4">
        <button className="btn btn-secondary" onClick={() => navigate('/student-dashboard')}>
          ← Back to Student Dashboard
        </button>
      </div>

      <div className="card p-4 shadow-sm">
        <GPAWhatIfAnalysis role="student" />
      </div>
    </div>
  );
}

export default StudentGPAWhatIf;

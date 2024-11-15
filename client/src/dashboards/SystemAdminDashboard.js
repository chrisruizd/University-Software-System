import React from 'react';
import { useNavigate } from 'react-router-dom';

function SystemAdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">System Administrator Dashboard</h2>
      <div className="d-flex flex-column align-items-center">
        <button className="btn btn-primary mb-3 w-50" onClick={() => navigate('/logs')}>
          View System Logs
        </button>
        <button className="btn btn-primary mb-3 w-50" onClick={() => navigate('/system-reports')}>
          View System Summary Reports
        </button>
        <button className="btn btn-secondary w-50" onClick={() => navigate('/logout')}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default SystemAdminDashboard;

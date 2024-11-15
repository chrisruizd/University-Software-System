import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function StaffDashboard() {
  const navigate = useNavigate();
  const [staffInfo, setStaffInfo] = useState({});
  const email = localStorage.getItem('email'); // Retrieve stored email

  useEffect(() => {
    const fetchStaffInfo = async () => {
      try {
        const response = await api.get(`/staff-info`, { params: { email } });
        setStaffInfo(response.data);
      } catch (error) {
        console.error('Failed to fetch staff info:', error);
      }
    };

    fetchStaffInfo();
  }, [email]);

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Sidebar Section */}
        <div className="col-md-4 col-lg-3 bg-light p-3 rounded">
          <h4 className="text-center">Staff Dashboard</h4>
          <div className="text-center mb-3">
            <div
              className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto"
              style={{ width: '80px', height: '80px', fontSize: '1.5rem' }}
            >
              {staffInfo.firstname?.[0]}{staffInfo.lastname?.[0]}
            </div>
          </div>
          <div className="text-center">
            <h5>Welcome, {staffInfo.firstname} {staffInfo.lastname}</h5>
            <ul className="list-unstyled mt-3">
              <li><strong>EID:</strong> {staffInfo.eid}</li>
              <li><strong>Email:</strong> {staffInfo.email}</li>
              <li><strong>Department ID:</strong> {staffInfo.departmentid}</li>
            </ul>
          </div>
          <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Main Content Section */}
        <div className="col-md-8 col-lg-9">
          <h3 className="text-center mb-4">Manage Records</h3>
          <div className="d-grid gap-3">
            <button className="btn btn-outline-primary" onClick={() => navigate('/staff/edit-student')}>
              View/Edit a Student
            </button>
            <button className="btn btn-outline-primary" onClick={() => navigate('/staff/edit-instructor')}>
              View/Edit an Instructor
            </button>
            <button className="btn btn-outline-primary" onClick={() => navigate('/staff/edit-course')}>
              View/Edit a Course
            </button>
            <button className="btn btn-outline-primary" onClick={() => navigate('/staff/edit-advisor')}>
              View/Edit an Advisor
            </button>
            <button className="btn btn-outline-primary" onClick={() => navigate('/staff/edit-department')}>
              View/Edit a Department
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;

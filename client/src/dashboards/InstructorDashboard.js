import React, { useEffect, useState } from 'react';
import api from '../services/api';

function InstructorDashboard() {
  const [instructorInfo, setInstructorInfo] = useState({});
  const [taughtCourses, setTaughtCourses] = useState([]);
  const email = localStorage.getItem('email');

  useEffect(() => {
    const fetchInstructorInfo = async () => {
      try {
        const response = await api.get(`/instructor-info`, { params: { email } });
        setInstructorInfo(response.data);
      } catch (error) {
        console.error('Failed to fetch instructor info:', error);
      }
    };

    const fetchTaughtCourses = async () => {
      try {
        const response = await api.get(`/instructor-courses`, { params: { email } });
        setTaughtCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch taught courses:', error);
      }
    };

    fetchInstructorInfo();
    fetchTaughtCourses();
  }, [email]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Sidebar Section */}
        <div className="col-md-4 col-lg-3 bg-light p-3 rounded">
          <h4 className="text-center">Instructor Dashboard</h4>
          <div className="text-center mb-3">
            <div
              className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto"
              style={{ width: '80px', height: '80px', fontSize: '1.5rem' }}
            >
              {instructorInfo.firstname?.[0]}{instructorInfo.lastname?.[0]}
            </div>
          </div>
          <div className="text-center">
            <h5>Welcome, {instructorInfo.firstname} {instructorInfo.lastname}</h5>
            <ul className="list-unstyled mt-3">
              <li><strong>EID:</strong> {instructorInfo.eid}</li>
              <li><strong>Email:</strong> {instructorInfo.email}</li>
              <li><strong>Department ID:</strong> {instructorInfo.departmentid}</li>
            </ul>
          </div>
          <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Main Content Section */}
        <div className="col-md-8 col-lg-9">
          <h3 className="text-center mb-4">Courses Taught</h3>

          {/* Taught Courses List */}
          {taughtCourses.length > 0 ? (
            <div className="row">
              {taughtCourses.map((course) => (
                <div className="col-sm-6 col-lg-4 mb-4" key={course.crn}>
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{course.name}</h5>
                      <p className="card-text">
                        <strong>CRN:</strong> {course.crn}<br />
                        <strong>Credits:</strong> {course.credits}<br />
                        <strong>Semester:</strong> {course.semester}, Year: {course.year}<br />
                        <strong>Start Time:</strong> {new Date(course.starttime).toLocaleTimeString()}<br />
                        <strong>End Time:</strong> {new Date(course.endtime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No courses assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;

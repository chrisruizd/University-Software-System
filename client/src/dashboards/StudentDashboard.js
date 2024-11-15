import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function StudentDashboard() {
  const [studentInfo, setStudentInfo] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const email = localStorage.getItem('email');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await api.get(`/student-info`, { params: { email } });
        setStudentInfo(response.data);
      } catch (error) {
        console.error('Failed to fetch student info:', error);
      }
    };

    const fetchEnrolledCourses = async () => {
      try {
        const response = await api.get(`/student-courses`, { params: { email } });
        setEnrolledCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch enrolled courses:', error);
      }
    };

    fetchStudentInfo();
    fetchEnrolledCourses();
  }, [email]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-4 col-lg-3 bg-light p-3 rounded">
          <h4 className="text-center mb-3">Student Dashboard</h4>
          <div className="text-center mb-3">
            <div
              className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto"
              style={{ width: '80px', height: '80px', fontSize: '1.5rem' }}
            >
              {studentInfo.firstname?.[0]}{studentInfo.lastname?.[0]}
            </div>
          </div>
          <div className="text-center">
            <h5>Welcome, {studentInfo.firstname} {studentInfo.lastname}</h5>
            <ul className="list-unstyled mt-3">
              <li><strong>GPA:</strong> {studentInfo.gpa}</li>
              <li><strong>Credits Earned:</strong> {studentInfo.credits}</li>
              <li><strong>UID:</strong> {studentInfo.uid}</li>
              <li><strong>Major:</strong> {studentInfo.majorin}</li>
              <li><strong>Email:</strong> {studentInfo.email}</li>
              <li><strong>Advisor:</strong> {studentInfo.advised_by}</li>
            </ul>
          </div>
          <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        {/* Main Content */}
        <div className="col-md-8 col-lg-9">
          <div className="text-center mb-3">
            <button className="btn btn-outline-primary w-100">View My Schedule</button>
          </div>
          <h3>Enrolled Courses</h3>
          <div className="row">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
                <div className="col-sm-6 col-lg-4 mb-4" key={course.crn}>
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{course.name}</h5>
                      <p className="card-text">
                        <strong>CRN:</strong> {course.crn}<br />
                        <strong>Instructor:</strong> {course.instructor || 'N/A'}<br />
                        <strong>Credits:</strong> {course.credits}<br />
                        <strong>Semester:</strong> {course.semester} {course.year}<br />
                        <strong>Start Time:</strong> {new Date(course.starttime).toLocaleTimeString()}<br />
                        <strong>End Time:</strong> {new Date(course.endtime).toLocaleTimeString()}<br />
                        <strong>Class Days:</strong> {course.classdays || 'N/A'}<br />
                        <strong>Grade:</strong> {course.completed ? course.grade : 'In Progress'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No enrolled courses found.</p>
            )}
          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => navigate('/student-gpa-what-if')}
            >
              What-if GPA Calculator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;

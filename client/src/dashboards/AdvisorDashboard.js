import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdvisorDashboard() {
  const [advisorInfo, setAdvisorInfo] = useState({});
  const [studentUID, setStudentUID] = useState('');
  const [studentCourses, setStudentCourses] = useState([]);
  const [newCRN, setNewCRN] = useState('');
  const [message, setMessage] = useState('');
  const email = localStorage.getItem('email');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdvisorInfo = async () => {
      try {
        const response = await api.get(`/advisor-info`, { params: { email } });
        setAdvisorInfo(response.data);
      } catch (error) {
        console.error('Failed to fetch advisor info:', error);
      }
    };

    fetchAdvisorInfo();
  }, [email]);

  const fetchStudentCourses = async () => {
    const advisorEID = advisorInfo.eid;
  
    try {
      const response = await api.get(`/student-courses/${studentUID}`, {
        params: { advisorEID },
      });
      setStudentCourses(response.data);
      setMessage('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to fetch student courses');
    }
  };
  

  const addCourseForStudent = async () => {
    const advisorEID = advisorInfo.eid;
  
    try {
      const response = await api.post(`/add-course`, {
        advisorEID,
        studentUID,
        crn: newCRN,
      });
      setMessage(response.data.message);
      fetchStudentCourses();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to add course');
    }
  };
  

  const dropCourseForStudent = async (crn) => {
    const advisorEID = advisorInfo.eid;
  
    try {
      const response = await api.post(`/drop-course`, {
        advisorEID,
        studentUID,
        crn,
      });
      setMessage(response.data.message);
      fetchStudentCourses();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to drop course');
    }
  };
  

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Sidebar Section */}
        <div className="col-md-4 col-lg-3 bg-light p-3 rounded">
          <h4 className="text-center">Advisor Dashboard</h4>
          <div className="text-center mb-3">
            <div
              className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto"
              style={{ width: '80px', height: '80px', fontSize: '1.5rem' }}
            >
              {advisorInfo.firstname?.[0]}{advisorInfo.lastname?.[0]}
            </div>
          </div>
          <div className="text-center">
            <h5>Welcome, {advisorInfo.firstname} {advisorInfo.lastname}</h5>
            <ul className="list-unstyled mt-3">
              <li><strong>EID:</strong> {advisorInfo.eid}</li>
              <li><strong>Email:</strong> {advisorInfo.email}</li>
              <li><strong>Department:</strong> {advisorInfo.departmentid}</li>
            </ul>
          </div>
          <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Main Content Section */}
        <div className="col-md-8 col-lg-9">
          <h3 className="text-center mb-4">Manage Student Courses</h3>

          {/* Student UID Input */}
          <div className="mb-4">
            <label htmlFor="studentUID" className="form-label">
              Enter Student UID to View Courses:
            </label>
            <div className="input-group">
              <input
                type="text"
                id="studentUID"
                className="form-control"
                value={studentUID}
                onChange={(e) => setStudentUID(e.target.value)}
                placeholder="Enter Student UID"
              />
              <button className="btn btn-primary" onClick={fetchStudentCourses}>
                Fetch Courses
              </button>
            </div>
          </div>

          {/* Student Courses List */}
          {studentCourses.length > 0 && (
            <div className="mb-4">
              <h4>Current Courses for Student {studentUID}</h4>
              <div className="list-group">
                {studentCourses.map((course) => (
                  <div key={course.crn} className="list-group-item">
                    <h5 className="mb-2">{course.name} ({course.crn})</h5>
                    <p>
                      <strong>Credits:</strong> {course.credits}<br />
                      <strong>Semester:</strong> {course.semester}, Year: {course.year}<br />
                      <strong>Grade:</strong> {course.completed ? course.grade : 'In Progress'}
                    </p>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => dropCourseForStudent(course.crn)}
                    >
                      Drop Course
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Course Section */}
          <div className="mb-4">
            <h4>Add Course for Student</h4>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={newCRN}
                onChange={(e) => setNewCRN(e.target.value)}
                placeholder="Enter Course CRN"
              />
              <button className="btn btn-success" onClick={addCourseForStudent}>
                Add Course
              </button>
            </div>
          </div>

          {/* Message Display */}
          {message && <div className="alert alert-info">{message}</div>}

          {/* What-if GPA Calculator Button */}
          <div className="text-center mt-4">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => navigate('/advisor-gpa-what-if')}
            >
              What-if GPA Calculator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvisorDashboard;

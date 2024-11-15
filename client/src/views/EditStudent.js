import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditStudent() {
  const [studentUID, setStudentUID] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [newStudent, setNewStudent] = useState({
    uid: '',
    hashpw: '',
    email: '',
    firstname: '',
    lastname: '',
    majorin: '',
    gpa: '',
    advised_by: '',
    credits: '',
  });

  const navigate = useNavigate();

  const fetchStudentData = async () => {
    try {
      const response = await api.get(`/students/${studentUID}`);
      setStudentData(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Failed to fetch student data');
    }
  };

  const toggleAddStudentForm = () => {
    setShowAddForm(!showAddForm);
    setStudentData(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const submitNewStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/students', newStudent);
      setMessage(response.data.message);
      setShowAddForm(false);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to add student');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">View/Edit a Student</h2>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-secondary" onClick={() => navigate('/staff-dashboard')}>
          Back to Staff Dashboard
        </button>
        <button className="btn btn-primary" onClick={toggleAddStudentForm}>
          {showAddForm ? 'Cancel Adding New Student' : 'Add a New Student'}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          value={studentUID}
          onChange={(e) => setStudentUID(e.target.value)}
          placeholder="Enter Student UID"
        />
        <button className="btn btn-primary w-100" onClick={fetchStudentData}>
          View/Edit Student Data
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {studentData && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">Student Details</h3>
            <p><strong>UID:</strong> {studentData.uid}</p>
            <p><strong>First Name:</strong> {studentData.firstname}</p>
            <p><strong>Last Name:</strong> {studentData.lastname}</p>
            <p><strong>Email:</strong> {studentData.email}</p>
            <p><strong>Major:</strong> {studentData.majorin}</p>
            <p><strong>GPA:</strong> {studentData.gpa}</p>
            <p><strong>Advised By:</strong> {studentData.advised_by}</p>
            <p><strong>Credits:</strong> {studentData.credits}</p>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">Add New Student</h3>
            <form onSubmit={submitNewStudent}>
              <div className="mb-3">
                <label>UID:</label>
                <input type="text" name="uid" className="form-control" value={newStudent.uid} onChange={handleInputChange} required />
              </div>

              <div className="mb-3">
                <label>Password (HashPW):</label>
                <input type="text" name="hashpw" className="form-control" value={newStudent.hashpw} onChange={handleInputChange} required />
              </div>

              <div className="mb-3">
                <label>Email:</label>
                <input type="email" name="email" className="form-control" value={newStudent.email} onChange={handleInputChange} required />
              </div>

              <div className="mb-3">
                <label>First Name:</label>
                <input type="text" name="firstname" className="form-control" value={newStudent.firstname} onChange={handleInputChange} required />
              </div>

              <div className="mb-3">
                <label>Last Name:</label>
                <input type="text" name="lastname" className="form-control" value={newStudent.lastname} onChange={handleInputChange} required />
              </div>

              <div className="mb-3">
                <label>Major:</label>
                <input type="text" name="majorin" className="form-control" value={newStudent.majorin} onChange={handleInputChange} required />
              </div>

              <div className="mb-3">
                <label>GPA:</label>
                <input type="number" step="0.01" name="gpa" className="form-control" value={newStudent.gpa} onChange={handleInputChange} required />
              </div>

              <div className="mb-3">
                <label>Advised By (Advisor EID):</label>
                <input type="text" name="advised_by" className="form-control" value={newStudent.advised_by} onChange={handleInputChange} />
              </div>

              <div className="mb-3">
                <label>Credits:</label>
                <input type="number" name="credits" className="form-control" value={newStudent.credits} onChange={handleInputChange} />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditStudent;

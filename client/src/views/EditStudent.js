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

  // Fetch student data
  const fetchStudentData = async () => {
    const staffEID = localStorage.getItem('staffEID'); // Retrieve staff EID from localStorage or context

    try {
      const response = await api.get(`/students/${studentUID}`, {
        params: { staffEID },
      });
      setStudentData(response.data);
      setMessage('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to fetch student data');
    }
  };


  // Toggle the form for adding a new student
  const toggleAddStudentForm = () => {
    setShowAddForm(!showAddForm);
    setStudentData(null);
  };

  // Handle input changes for both add and edit forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (studentData) {
      setStudentData({ ...studentData, [name]: value });
    } else {
      setNewStudent({ ...newStudent, [name]: value });
    }
  };

  // add new student
  const submitNewStudent = async (e) => {
    e.preventDefault();
    const staffEID = localStorage.getItem('staffEID'); // Retrieve the staff EID from localStorage
  
    try {
      const response = await api.post('/students', { ...newStudent, staffEID });
      setMessage(response.data.message);
      setShowAddForm(false);
      setNewStudent({
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
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to add student');
    }
  };
  
  

  // Update existing student data
  const updateStudentData = async () => {
    const staffEID = localStorage.getItem('staffEID'); // Retrieve staff EID from localStorage
  
    try {
      const response = await api.put(`/students/${studentData.uid}`, {
        ...studentData,
        staffEID,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update student');
    }
  };
  

  // Delete student data
  const deleteStudentData = async () => {
    const staffEID = localStorage.getItem('staffEID'); // Retrieve staff EID from localStorage

    if (!window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await api.delete(`/students/${studentData.uid}`, {
        data: { staffEID },
      });
      setMessage(response.data.message);
      setStudentData(null); // Clear the student data after deletion
      setStudentUID(''); // Reset the input field
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to delete student');
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
            <h3 className="card-title">Edit Student Details</h3>
            <form>
              <div className="mb-3">
                <label>UID:</label>
                <input type="text" name="uid" className="form-control" value={studentData.uid} readOnly />
              </div>

              <div className="mb-3">
                <label>Password (HashPW):</label>
                <input
                  type="text"
                  name="hashpw"
                  className="form-control"
                  value={studentData.hashpw}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={studentData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label>First Name:</label>
                <input
                  type="text"
                  name="firstname"
                  className="form-control"
                  value={studentData.firstname}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lastname"
                  className="form-control"
                  value={studentData.lastname}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label>Major:</label>
                <input
                  type="text"
                  name="majorin"
                  className="form-control"
                  value={studentData.majorin}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label>GPA:</label>
                <input
                  type="number"
                  step="0.01"
                  name="gpa"
                  className="form-control"
                  value={studentData.gpa}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label>Advised By (Advisor EID):</label>
                <input
                  type="text"
                  name="advised_by"
                  className="form-control"
                  value={studentData.advised_by}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label>Credits:</label>
                <input
                  type="number"
                  name="credits"
                  className="form-control"
                  value={studentData.credits}
                  onChange={handleInputChange}
                />
              </div>

              <button type="button" className="btn btn-success w-100" onClick={updateStudentData}>
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-danger w-100 mt-3"
                onClick={deleteStudentData}
              >
                Delete Student
              </button>
            </form>
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
          <input
            type="text"
            name="uid"
            className="form-control"
            value={newStudent.uid}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password (HashPW):</label>
          <input
            type="text"
            name="hashpw"
            className="form-control"
            value={newStudent.hashpw}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={newStudent.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            className="form-control"
            value={newStudent.firstname}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            className="form-control"
            value={newStudent.lastname}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Major:</label>
          <input
            type="text"
            name="majorin"
            className="form-control"
            value={newStudent.majorin}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>GPA:</label>
          <input
            type="number"
            step="0.01"
            name="gpa"
            className="form-control"
            value={newStudent.gpa}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Advised By (Advisor EID):</label>
          <input
            type="text"
            name="advised_by"
            className="form-control"
            value={newStudent.advised_by}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label>Credits:</label>
          <input
            type="number"
            name="credits"
            className="form-control"
            value={newStudent.credits}
            onChange={handleInputChange}
          />
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

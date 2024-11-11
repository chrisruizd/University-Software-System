// src/views/EditStudent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function EditStudent() {
  const [studentUID, setStudentUID] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // State for new student attributes
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

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch student data by UID
  const fetchStudentData = async () => {
    try {
      const response = await api.get(`/students/${studentUID}`);
      setStudentData(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Failed to fetch student data');
    }
  };

  // Toggle the form for adding a new student
  const toggleAddStudentForm = () => {
    setShowAddForm(!showAddForm);
    setStudentData(null); // Clear current student data if showing add form
  };

  // Handle form input changes for adding a new student
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  // Submit new student data
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
    <div>
      <h2>View/Edit a Student</h2>

      <div>
        {/* Back to Staff Dashboard Button */}
        <button onClick={() => navigate('/staff-dashboard')}>Back to Staff Dashboard</button>
      </div>
      <br></br>

      {/* Input for fetching student data */}
      <input
        type="text"
        value={studentUID}
        onChange={(e) => setStudentUID(e.target.value)}
        placeholder="Enter Student UID"
      />
      <button onClick={fetchStudentData}>View/Edit Student Data</button>
      <button onClick={toggleAddStudentForm}>Add a New Student</button>
      
      {message && <p>{message}</p>}
      
      {/* Display student data if available */}
      {studentData && (
        <div>
          <h3>Student Details</h3>
          <p>UID: {studentData.uid}</p>
          <p>First Name: {studentData.firstname}</p>
          <p>Last Name: {studentData.lastname}</p>
          <p>Email: {studentData.email}</p>
          <p>Major: {studentData.majorin}</p>
          <p>GPA: {studentData.gpa}</p>
          <p>Advised By: {studentData.advised_by}</p>
          <p>Credits: {studentData.credits}</p>
          {/* Add more fields as needed */}
        </div>
      )}

      {/* Add Student Form */}
      {showAddForm && (
        <div>
          <h3>Add New Student</h3>
          <form onSubmit={submitNewStudent}>
            <label>UID:</label>
            <input type="text" name="uid" value={newStudent.uid} onChange={handleInputChange} required />

            <label>Password (HashPW):</label>
            <input type="text" name="hashpw" value={newStudent.hashpw} onChange={handleInputChange} required />

            <label>Email:</label>
            <input type="email" name="email" value={newStudent.email} onChange={handleInputChange} required />

            <label>First Name:</label>
            <input type="text" name="firstname" value={newStudent.firstname} onChange={handleInputChange} required />

            <label>Last Name:</label>
            <input type="text" name="lastname" value={newStudent.lastname} onChange={handleInputChange} required />

            <label>Major:</label>
            <input type="text" name="majorin" value={newStudent.majorin} onChange={handleInputChange} required />

            <label>GPA:</label>
            <input type="number" step="0.01" name="gpa" value={newStudent.gpa} onChange={handleInputChange} required />

            <label>Advised By (Advisor EID):</label>
            <input type="text" name="advised_by" value={newStudent.advised_by} onChange={handleInputChange} />

            <label>Credits:</label>
            <input type="number" name="credits" value={newStudent.credits} onChange={handleInputChange} />

            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default EditStudent;

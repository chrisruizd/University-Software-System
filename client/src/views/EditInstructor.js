// src/views/EditInstructor.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function EditInstructor() {
  const [instructorEID, setInstructorEID] = useState('');
  const [instructorData, setInstructorData] = useState(null);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [newInstructor, setNewInstructor] = useState({
    eid: '',
    hashpw: '',
    email: '',
    firstname: '',
    lastname: '',
    departmentid: '',
  });

  const navigate = useNavigate(); // Initialize useNavigate

  //const staffEID = localStorage.getItem('staffEID'); // Assume staff EID is stored in local storage

  // Fetch instructor data by EID
  const fetchInstructorData = async () => {
    try {
      const response = await api.get(`/instructors/${instructorEID}`);
      setInstructorData(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Failed to fetch instructor data');
    }
  };

  // Toggle the form for adding a new instructor
  const toggleAddInstructorForm = () => {
    setShowAddForm(!showAddForm);
    setInstructorData(null); // Clear current instructor data if showing add form
  };

  // Handle form input changes for adding a new instructor
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInstructor({ ...newInstructor, [name]: value });
  };

  // Submit new instructor data
  const submitNewInstructor = async (e) => {
    const staffEID = localStorage.getItem('userEID');
    e.preventDefault();
    try {
      const response = await api.post('/instructors', { ...newInstructor, staffEID });
      setMessage(response.data.message);
      setShowAddForm(false);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to add instructor');
    }
  };

    // Handle input changes for instructor data update
    const handleInputUpdate = (e) => {
      const { name, value } = e.target;
      setInstructorData({ ...instructorData, [name]: value });
    };
  
    // Submit updated instructor data
    const updateInstructorData = async () => {
      const staffEID = localStorage.getItem('userEID');
      try {
        const response = await api.put(`/instructors/${instructorEID}`, {
          ...instructorData,
          staffEID, // Include the staff EID for authorization
        });
        setMessage(response.data.message);
      } catch (error) {
        setMessage(error.response?.data?.error || 'Failed to update instructor');
      }
    };

  return (
    <div>
      <h2>View/Edit an Instructor</h2>

      <div>
        {/* Back to Staff Dashboard Button */}
        <button onClick={() => navigate('/staff-dashboard')}>Back to Staff Dashboard</button>
      </div>
      <br></br>
      
      {/* Input for fetching instructor data */}
      <input
        type="text"
        value={instructorEID}
        onChange={(e) => setInstructorEID(e.target.value)}
        placeholder="Enter Instructor EID"
      />
      <button onClick={fetchInstructorData}>View/Edit Instructor Data</button>
      <button onClick={toggleAddInstructorForm}>Add a New Instructor</button>
      
      {message && <p>{message}</p>}
      
      {/* Display instructor data if available */}
      {instructorData && (
        <div>
          <h3>Instructor Details</h3>
          <p>EID: {instructorData.eid}</p>
          <p>First Name: {instructorData.firstname}</p>
          <p>Last Name: {instructorData.lastname}</p>
          <p>Email: {instructorData.email}</p>
          <p>Department ID: {instructorData.departmentid}</p>

          <div>
            <h3>Edit Instructor Details</h3>
            <form>
              <label>EID:</label>
              <input type="text" name="eid" value={instructorData.eid} readOnly />

              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={instructorData.email}
                onChange={handleInputUpdate}
              />

              <label>First Name:</label>
              <input
                type="text"
                name="firstname"
                value={instructorData.firstname}
                onChange={handleInputUpdate}
              />

              <label>Last Name:</label>
              <input
                type="text"
                name="lastname"
                value={instructorData.lastname}
                onChange={handleInputUpdate}
              />

              <label>Department ID:</label>
              <input
                type="text"
                name="departmentid"
                value={instructorData.departmentid}
                onChange={handleInputUpdate}
              />

              <button type="button" onClick={updateInstructorData}>Save Changes</button>
            </form>
          </div>
          
        </div>

        
        //----------
      )}
      

      {/* Add Instructor Form */}
      {showAddForm && (
        <div>
          <h3>Add New Instructor</h3>
          <form onSubmit={submitNewInstructor}>
            <label>EID:</label>
            <input type="text" name="eid" value={newInstructor.eid} onChange={handleInputChange} required />

            <label>Password (HashPW):</label>
            <input type="text" name="hashpw" value={newInstructor.hashpw} onChange={handleInputChange} required />

            <label>Email:</label>
            <input type="email" name="email" value={newInstructor.email} onChange={handleInputChange} required />

            <label>First Name:</label>
            <input type="text" name="firstname" value={newInstructor.firstname} onChange={handleInputChange} required />

            <label>Last Name:</label>
            <input type="text" name="lastname" value={newInstructor.lastname} onChange={handleInputChange} required />

            <label>Department ID:</label>
            <input type="text" name="departmentid" value={newInstructor.departmentid} onChange={handleInputChange} required />

            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default EditInstructor;

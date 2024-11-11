// src/views/EditAdvisor.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function EditAdvisor() {
  const [advisorEID, setAdvisorEID] = useState('');
  const [advisorData, setAdvisorData] = useState(null);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [newAdvisor, setNewAdvisor] = useState({
    eid: '',
    hashpw: '',
    email: '',
    firstname: '',
    lastname: '',
    departmentid: '',
  });

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch advisor data by EID
  const fetchAdvisorData = async () => {
    try {
      const response = await api.get(`/advisors/${advisorEID}`);
      setAdvisorData(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Failed to fetch advisor data');
    }
  };

  // Toggle the form for adding a new advisor
  const toggleAddAdvisorForm = () => {
    setShowAddForm(!showAddForm);
    setAdvisorData(null); // Clear current advisor data if showing add form
  };

  // Handle form input changes for adding a new advisor
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdvisor({ ...newAdvisor, [name]: value });
  };

  // Submit new advisor data
  const submitNewAdvisor = async (e) => {
    const staffEID = localStorage.getItem('userEID');
    e.preventDefault();
    try {
      const response = await api.post('/advisors', { ...newAdvisor, staffEID });
      setMessage(response.data.message);
      setShowAddForm(false);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to add advisor');
    }
  };

  // Handle input changes for advisor data update
  const handleInputUpdate = (e) => {
    const { name, value } = e.target;
    setAdvisorData({ ...advisorData, [name]: value });
  };

  // Submit updated advisor data
  const updateAdvisorData = async () => {
    const staffEID = localStorage.getItem('userEID');
    try {
      const response = await api.put(`/advisors/${advisorEID}`, {
        ...advisorData,
        staffEID, // Include the staff EID for authorization
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update advisor');
    }
  };

  return (
    <div>
      <h2>View/Edit an Advisor</h2>

      <div>
        <button onClick={() => navigate('/staff-dashboard')}>Back to Staff Dashboard</button>
      </div>
      <br></br>

      <input
        type="text"
        value={advisorEID}
        onChange={(e) => setAdvisorEID(e.target.value)}
        placeholder="Enter Advisor EID"
      />
      <button onClick={fetchAdvisorData}>View/Edit Advisor Data</button>
      <button onClick={toggleAddAdvisorForm}>Add a New Advisor</button>

      {message && <p>{message}</p>}

      {advisorData && (
        <div>
          <h3>Advisor Details</h3>
          <p>EID: {advisorData.eid}</p>
          <p>First Name: {advisorData.firstname}</p>
          <p>Last Name: {advisorData.lastname}</p>
          <p>Email: {advisorData.email}</p>
          <p>Department ID: {advisorData.departmentid}</p>

          <div>
            <h3>Edit Advisor Details</h3>
            <form>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={advisorData.email}
                onChange={handleInputUpdate}
              />

              <label>First Name:</label>
              <input
                type="text"
                name="firstname"
                value={advisorData.firstname}
                onChange={handleInputUpdate}
              />

              <label>Last Name:</label>
              <input
                type="text"
                name="lastname"
                value={advisorData.lastname}
                onChange={handleInputUpdate}
              />

              <label>Department ID:</label>
              <input
                type="text"
                name="departmentid"
                value={advisorData.departmentid}
                onChange={handleInputUpdate}
              />

              <button type="button" onClick={updateAdvisorData}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {showAddForm && (
        <div>
          <h3>Add New Advisor</h3>
          <form onSubmit={submitNewAdvisor}>
            <label>EID:</label>
            <input type="text" name="eid" value={newAdvisor.eid} onChange={handleInputChange} required />

            <label>Password (HashPW):</label>
            <input type="text" name="hashpw" value={newAdvisor.hashpw} onChange={handleInputChange} required />

            <label>Email:</label>
            <input type="email" name="email" value={newAdvisor.email} onChange={handleInputChange} required />

            <label>First Name:</label>
            <input type="text" name="firstname" value={newAdvisor.firstname} onChange={handleInputChange} required />

            <label>Last Name:</label>
            <input type="text" name="lastname" value={newAdvisor.lastname} onChange={handleInputChange} required />

            <label>Department ID:</label>
            <input type="text" name="departmentid" value={newAdvisor.departmentid} onChange={handleInputChange} required />

            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default EditAdvisor;

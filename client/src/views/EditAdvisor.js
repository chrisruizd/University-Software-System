import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  const navigate = useNavigate();

  const fetchAdvisorData = async () => {
    try {
      const response = await api.get(`/advisors/${advisorEID}`);
      setAdvisorData(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Failed to fetch advisor data');
    }
  };

  const toggleAddAdvisorForm = () => {
    setShowAddForm(!showAddForm);
    setAdvisorData(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdvisor({ ...newAdvisor, [name]: value });
  };

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

  const handleInputUpdate = (e) => {
    const { name, value } = e.target;
    setAdvisorData({ ...advisorData, [name]: value });
  };

  const updateAdvisorData = async () => {
    const staffEID = localStorage.getItem('userEID');
    try {
      const response = await api.put(`/advisors/${advisorEID}`, { ...advisorData, staffEID });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update advisor');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">View/Edit an Advisor</h2>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-secondary" onClick={() => navigate('/staff-dashboard')}>
          Back to Staff Dashboard
        </button>
        <button className="btn btn-primary" onClick={toggleAddAdvisorForm}>
          {showAddForm ? 'Cancel Adding New Advisor' : 'Add a New Advisor'}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          value={advisorEID}
          onChange={(e) => setAdvisorEID(e.target.value)}
          placeholder="Enter Advisor EID"
        />
        <button className="btn btn-primary w-100" onClick={fetchAdvisorData}>
          View/Edit Advisor Data
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {advisorData && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">Advisor Details</h3>
            <form>
              <div className="mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={advisorData.email}
                  onChange={handleInputUpdate}
                />
              </div>

              <div className="mb-3">
                <label>First Name:</label>
                <input
                  type="text"
                  name="firstname"
                  className="form-control"
                  value={advisorData.firstname}
                  onChange={handleInputUpdate}
                />
              </div>

              <div className="mb-3">
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lastname"
                  className="form-control"
                  value={advisorData.lastname}
                  onChange={handleInputUpdate}
                />
              </div>

              <div className="mb-3">
                <label>Department ID:</label>
                <input
                  type="text"
                  name="departmentid"
                  className="form-control"
                  value={advisorData.departmentid}
                  onChange={handleInputUpdate}
                />
              </div>

              <button type="button" className="btn btn-success w-100" onClick={updateAdvisorData}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">Add New Advisor</h3>
            <form onSubmit={submitNewAdvisor}>
              <div className="mb-3">
                <label>EID:</label>
                <input
                  type="text"
                  name="eid"
                  className="form-control"
                  value={newAdvisor.eid}
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
                  value={newAdvisor.hashpw}
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
                  value={newAdvisor.email}
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
                  value={newAdvisor.firstname}
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
                  value={newAdvisor.lastname}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Department ID:</label>
                <input
                  type="text"
                  name="departmentid"
                  className="form-control"
                  value={newAdvisor.departmentid}
                  onChange={handleInputChange}
                  required
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

export default EditAdvisor;

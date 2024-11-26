import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function EditDepartment() {
  const [departmentData, setDepartmentData] = useState(null);
  const [majors, setMajors] = useState([]);
  const [newMajor, setNewMajor] = useState("");
  const [message, setMessage] = useState("");
  const staffEID = localStorage.getItem("userEID");
  const navigate = useNavigate();

  // Fetch department data
  const fetchDepartmentData = async () => {
    try {
      const response = await api.get("/department-info", { params: { staffEID } });
      setDepartmentData(response.data);
    } catch (error) {
      setMessage("Failed to fetch department data");
    }
  };

  // Fetch majors for the staff's department
  const fetchMajors = async () => {
    try {
      const response = await api.get("/majors", { params: { staffEID } });
      setMajors(response.data);
    } catch (error) {
      setMessage("Failed to fetch majors");
    }
  };

  // Update department data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDepartmentData({ ...departmentData, [name]: value });
  };

  const updateDepartmentData = async () => {
    try {
      const response = await api.put("/edit-department", { staffEID, ...departmentData });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Failed to update department data");
    }
  };

  // Add a new major
  const handleAddMajor = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/add-major", {
        staffEID,
        name: newMajor,
      });
      setMessage(response.data.message);
      setNewMajor("");
      fetchMajors(); // Refresh the list of majors
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to add major");
    }
  };

  useEffect(() => {
    fetchDepartmentData();
    fetchMajors();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-secondary" onClick={() => navigate("/staff-dashboard")}>
          Back to Staff Dashboard
        </button>
      </div>

      <h2 className="text-center">Edit Department Details</h2>
      {message && <div className="alert alert-info">{message}</div>}

      {departmentData && (
        <form>
          <div className="mb-3">
            <label>Department Name:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={departmentData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label>Abbreviation:</label>
            <input
              type="text"
              className="form-control"
              name="abbreviation"
              value={departmentData.abbreviation}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label>Building:</label>
            <input
              type="text"
              className="form-control"
              name="building"
              value={departmentData.building}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label>Office:</label>
            <input
              type="text"
              className="form-control"
              name="office"
              value={departmentData.office}
              onChange={handleInputChange}
            />
          </div>

          <button type="button" className="btn btn-success w-100" onClick={updateDepartmentData}>
            Save Changes
          </button>
        </form>
      )}

      <hr />

      <h3>Majors in Your Department</h3>
      <ul className="list-group mb-4">
        {majors.length > 0 ? (
          majors.map((major, index) => (
            <li key={index} className="list-group-item">
              {major.name}
            </li>
          ))
        ) : (
          <li className="list-group-item">No majors found</li>
        )}
      </ul>

      <h3>Add a New Major</h3>
      <form onSubmit={handleAddMajor}>
        <div className="mb-3">
          <label>Major Name:</label>
          <input
            type="text"
            className="form-control"
            value={newMajor}
            onChange={(e) => setNewMajor(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Add Major
        </button>
      </form>
    </div>
  );
}

export default EditDepartment;

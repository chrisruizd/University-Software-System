import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

function EditInstructor() {
  const [instructorEID, setInstructorEID] = useState("");
  const [courseCRN, setCourseCRN] = useState("");
  const [instructorData, setInstructorData] = useState(null);
  const [message, setMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const [newInstructor, setNewInstructor] = useState({
    eid: "",
    hashpw: "",
    email: "",
    firstname: "",
    lastname: "",
    departmentid: "",
  });

  const navigate = useNavigate();

  // Fetch instructor data
  const fetchInstructorData = async () => {
    const staffEID = localStorage.getItem("userEID"); // Retrieve the staff EID from localStorage

    try {
      const response = await api.get(`/instructors/${instructorEID}`, {
        params: { staffEID },
      });
      setInstructorData(response.data);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to fetch instructor data");
    }
  };

  const toggleAddInstructorForm = () => {
    setShowAddForm(!showAddForm);
    setInstructorData(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInstructor({ ...newInstructor, [name]: value });
  };

  const submitNewInstructor = async (e) => {
    const staffEID = localStorage.getItem("userEID");
    e.preventDefault();
    try {
      const response = await api.post("/instructors", { ...newInstructor, staffEID });
      setMessage(response.data.message);
      setShowAddForm(false);
      // Reset the form to its initial state
      setNewInstructor({
        eid: "",
        hashpw: "",
        email: "",
        firstname: "",
        lastname: "",
        departmentid: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to add instructor");
    }
  };

  const handleInputUpdate = (e) => {
    const { name, value } = e.target;
    setInstructorData({ ...instructorData, [name]: value });
  };

  const updateInstructorData = async () => {
    const staffEID = localStorage.getItem("userEID");
    try {
      const response = await api.put(`/instructors/${instructorEID}`, {
        ...instructorData,
        staffEID,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to update instructor");
    }
  };

  const handleAssignCourse = async (e) => {
    e.preventDefault();

    const staffEID = localStorage.getItem("userEID"); // Retrieve staff EID from localStorage
    try {
      const response = await api.post("/assign-course", {
        instructorEID,
        crn: courseCRN,
        staffEID,
      });
      setMessage(response.data.message);
      setInstructorEID("");
      setCourseCRN("");
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to assign course");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Manage Instructors and Assign Courses</h2>

      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/staff-dashboard")}
        >
          Back to Staff Dashboard
        </button>
        <button
          className="btn btn-primary"
          onClick={toggleAddInstructorForm}
        >
          {showAddForm ? "Cancel Adding New Instructor" : "Add a New Instructor"}
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          value={instructorEID}
          onChange={(e) => setInstructorEID(e.target.value)}
          placeholder="Enter Instructor EID"
        />
        <button
          className="btn btn-primary w-100 mb-3"
          onClick={fetchInstructorData}
        >
          View/Edit Instructor Data
        </button>
        <form onSubmit={handleAssignCourse}>
          <input
            type="text"
            className="form-control mb-2"
            value={courseCRN}
            onChange={(e) => setCourseCRN(e.target.value)}
            placeholder="Enter Course CRN"
          />
          <button type="submit" className="btn btn-success w-100">
            Assign Course
          </button>
        </form>
      </div>

      {instructorData && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">Instructor Details</h3>
            <form>
              <div className="mb-3">
                <label>EID:</label>
                <input
                  type="text"
                  name="eid"
                  className="form-control"
                  value={instructorData.eid}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={instructorData.email}
                  onChange={handleInputUpdate}
                />
              </div>

              <div className="mb-3">
                <label>First Name:</label>
                <input
                  type="text"
                  name="firstname"
                  className="form-control"
                  value={instructorData.firstname}
                  onChange={handleInputUpdate}
                />
              </div>

              <div className="mb-3">
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lastname"
                  className="form-control"
                  value={instructorData.lastname}
                  onChange={handleInputUpdate}
                />
              </div>

              <div className="mb-3">
                <label>Department ID:</label>
                <input
                  type="text"
                  name="departmentid"
                  className="form-control"
                  value={instructorData.departmentid}
                  onChange={handleInputUpdate}
                />
              </div>

              <button
                type="button"
                className="btn btn-success w-100"
                onClick={updateInstructorData}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">Add New Instructor</h3>
            <form onSubmit={submitNewInstructor}>
              <div className="mb-3">
                <label>EID:</label>
                <input
                  type="text"
                  name="eid"
                  className="form-control"
                  value={newInstructor.eid}
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
                  value={newInstructor.hashpw}
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
                  value={newInstructor.email}
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
                  value={newInstructor.firstname}
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
                  value={newInstructor.lastname}
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
                  value={newInstructor.departmentid}
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

export default EditInstructor;

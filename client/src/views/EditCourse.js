import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditCourse() {
  const [crn, setCRN] = useState('');
  const [courseData, setCourseData] = useState(null);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // State for new course attributes
  const [newCourse, setNewCourse] = useState({
    crn: '',
    credits: '',
    name: '',
    departmentid: '',
    days: '',
    semester: '',
    year: '',
    startTime: '',
    endTime: ''
  });

  const navigate = useNavigate();

  // Helper function to extract time in HH:mm format
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };


  const fetchCourseData = async () => {
    try {
      const response = await api.get(`/courses/${crn.toString()}`);
      const data = response.data;
      // Format startTime and endTime
      data.startTime = formatTime(data.starttime);
      data.endTime = formatTime(data.endtime);
      setCourseData(data);
      setMessage('');
    } catch (error) {
      setMessage('Failed to fetch course data');
    }
  };
  
  

  // Toggle the form for adding a new course
  const toggleAddCourseForm = () => {
    setShowAddForm(!showAddForm);
    setCourseData(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  // Submit new course data
  const submitNewCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/courses', newCourse);
      setMessage(response.data.message);
      setShowAddForm(false);
      setNewCourse({
        crn: '',
        credits: '',
        name: '',
        departmentid: '',
        days: '',
        semester: '',
        year: '',
        startTime: '',
        endTime: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to add course');
    }
  };

  // Handle input changes for updating course data
  const handleInputUpdate = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  // Submit updated course data
  const updateCourseData = async () => {
    try {
      const response = await api.put(`/courses/${crn}`, courseData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update course');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">View/Edit a Course</h2>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-secondary" onClick={() => navigate('/staff-dashboard')}>
          Back to Staff Dashboard
        </button>
        <button className="btn btn-primary" onClick={toggleAddCourseForm}>
          {showAddForm ? 'Cancel Adding New Course' : 'Add a New Course'}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          value={crn}
          onChange={(e) => setCRN(e.target.value)}
          placeholder="Enter Course CRN"
        />
        <button className="btn btn-primary w-100" onClick={fetchCourseData}>
          View/Edit Course Data
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {courseData && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">Course Details</h3>
            <form>
              <div className="mb-3">
                <label>Course Name:</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={courseData.name}
                  onChange={handleInputUpdate}
                />
              </div>

              <div className="mb-3">
                <label>CRN:</label>
                <input
                  type="text"
                  name="crn"
                  className="form-control"
                  value={courseData.crn}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label>Credits:</label>
                <input
                  type="number"
                  name="credits"
                  className="form-control"
                  value={courseData.credits}
                  onChange={handleInputUpdate}
                />
              </div>

              <div className="mb-3">
                <label>Department ID:</label>
                <input
                  type="text"
                  name="departmentid"
                  className="form-control"
                  value={courseData.departmentid}
                  onChange={handleInputUpdate}
                />
              </div>

              <div className="mb-3">
                <label>Days:</label>
                <input
                  type="text"
                  name="days"
                  className="form-control"
                  value={courseData.days}
                  onChange={handleInputUpdate}
                />
              </div>

              <div className="mb-3">
                <label>Semester:</label>
                <input
                  type="text"
                  name="semester"
                  className="form-control"
                  value={courseData.semester}
                  onChange={handleInputUpdate}
                />
              </div>

              <div className="mb-3">
                <label>Year:</label>
                <input
                  type="number"
                  name="year"
                  className="form-control"
                  value={courseData.year}
                  onChange={handleInputUpdate}
                />
              </div>

              <div className="mb-3">
                <label>Start Time:</label>
                <input
                  type="time"
                  name="startTime"
                  className="form-control"
                  value={courseData.startTime}
                  onChange={handleInputUpdate}
                />
              </div>

              <div className="mb-3">
                <label>End Time:</label>
                <input
                  type="time"
                  name="endTime"
                  className="form-control"
                  value={courseData.endTime}
                  onChange={handleInputUpdate}
                />
              </div>

              <button type="button" className="btn btn-success w-100" onClick={updateCourseData}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">Add New Course</h3>
            <form onSubmit={submitNewCourse}>
              {Object.keys(newCourse).map((key) => (
                <div className="mb-3" key={key}>
                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                  <input
                    type="text"
                    name={key}
                    className="form-control"
                    value={newCourse[key]}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}
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

export default EditCourse;

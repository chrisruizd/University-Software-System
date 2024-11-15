import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role set to "student"
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/login', {
        email,
        password,
        role,
      });
      setMessage(response.data.message);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('email', email);

      const { userEID } = response.data;
      localStorage.setItem('userEID', userEID);

      if (role === 'staff') {
        localStorage.setItem('staffEID', userEID);
      } else if (role === 'instructor') {
        localStorage.setItem('instructorEID', userEID);
      } else if (role === 'student') {
        localStorage.setItem('studentUID', userEID);
      }

      if (response.data.role === 'student') {
        window.location.href = '/student-dashboard';
      } else if (response.data.role === 'advisor') {
        window.location.href = '/advisor-dashboard';
      } else if (response.data.role === 'staff') {
        window.location.href = '/staff-dashboard';
      } else if (response.data.role === 'instructor') {
        window.location.href = '/instructor-dashboard';
      }
    } catch (error) {
      setMessage('Login failed: ' + (error.response ? error.response.data.error : error.message));
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Login to your University Dashboard</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ backgroundColor: '#d3d3d3' }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ backgroundColor: '#d3d3d3' }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Select Role</label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ backgroundColor: '#d3d3d3' }}
            >
              <option value="student">Student</option>
              <option value="advisor">Advisor</option>
              <option value="staff">Staff</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          <button type="submit" className="btn btn-dark w-100">Login</button>
        </form>
        {message && <p className="text-center mt-3 text-danger">{message}</p>}
      </div>
    </div>
  );
}

export default Login;

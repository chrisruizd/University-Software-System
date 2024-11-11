// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';

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
        role, // Pass the role to the backend
      });
      setMessage(response.data.message);
      // Store token and role, then redirect based on role
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      localStorage.setItem('email', email); // Store email for dashboard requests

      const { userEID } = response.data; 
      localStorage.setItem('userEID', userEID);

      // Store role and identifier based on role type
      localStorage.setItem('role', role);
      if (role === 'staff') {
        localStorage.setItem('staffEID', userEID);
      } else if (role === 'instructor') {
        localStorage.setItem('instructorEID', userEID);
      } else if (role === 'student') {
        localStorage.setItem('studentUID', userEID);
      }

      // Redirect based on role
      //print(response.data.role)
      if (response.data.role === 'student') {
        window.location.href = "/student-dashboard";
      } else if (response.data.role === 'advisor') {
        window.location.href = "/advisor-dashboard";
      } else if (response.data.role === 'staff') {
        window.location.href = "/staff-dashboard";
      } else if (response.data.role === 'instructor') {
        window.location.href = "/instructor-dashboard";
      }
    } catch (error) {
      setMessage('Login failed: ' + (error.response ? error.response.data.error : error.message));
    }
  };

  return (
    <div>
      <h1>Welcome to UniView</h1>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="advisor">Advisor</option>
          <option value="staff">Staff</option>
          <option value="instructor">Instructor</option>
        </select>
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;

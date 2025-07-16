// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/user/login', { email, password });
      localStorage.setItem('token', res.data.token);
      alert('✅ Login successful!');
      setLoggedIn(true); // Show logo
      setTimeout(() => navigate('/'), 1500); // Redirect after 1.5s
    } catch (err) {
      alert('❌ Invalid email or password');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>🔐 Login</h2>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <p>Don't have an account? <a href="/register">Register</a></p>

            
            <p className="welcome-msg">Welcome to SmartReceipt AI!</p>
          </div>
      
      </div>
    
  );
};

export default Login;

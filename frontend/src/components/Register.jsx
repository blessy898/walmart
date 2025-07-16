import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogo, setShowLogo] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("❗ Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/user/register', {
        name,
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setShowLogo(true);
        alert('✅ Registered successfully!');
        setTimeout(() => navigate('/'), 1500);
      } else {
        alert("❌ Something went wrong. No token received.");
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error registering user');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>📝 Register</h2>
        <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleRegister}>Register</button>
        <p>Already have an account? <a href="/login">Login</a></p>

        
            
            <p className="welcome-msg">Welcome to SmartReceipt AI!</p>
          </div>
      
      </div>
    
  );
};

export default Register;

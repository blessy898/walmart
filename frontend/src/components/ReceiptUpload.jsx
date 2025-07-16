import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ReceiptUpload.css';

const ReceiptUpload = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  // 🔐 Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ Please login to access this page.');
      navigate('/login');
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) return alert('Please select a receipt image!');
    const formData = new FormData();
    formData.append('receipt', image);

    try {
      const res = await axios.post('http://localhost:5000/api/receipt/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setResult(res.data);
    } catch (err) {
      console.error('❌ Upload failed:', err.message);
      alert('Upload failed. Check backend.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('🚪 Logged out successfully!');
    navigate('/login');
  };

  const getGroupedData = () => {
    const categories = ['Fruits', 'Vegetables', 'Dairy', 'Grains', 'Snacks', 'Other'];
    const grouped = {};
    categories.forEach((cat) => (grouped[cat] = []));
    result?.categorizedItems?.forEach((item) => {
      const category = item.category || 'Other';
      grouped[category].push(item);
    });
    return grouped;
  };

  return (
    <div className="upload-page">
      {/* 🔗 Top Navigation */}
      <div className="nav-bar">
        {localStorage.getItem('token') ? (
          <div className="user-logo-container">
  <div className="logo-circle">
    <img
      src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
      alt="SmartReceipt Logo"
      className="top-logo"
      onClick={() => setShowLogout(!showLogout)}
    />
  </div>
  <p className="logo-label">Me</p>

  {showLogout && (
    <button className="logout-dropdown" onClick={handleLogout}>
      🚪 Logout
    </button>
  )}
</div>

        ) : (
          <div className="nav-links">
            <Link to="/login">🔐 Login</Link> | <Link to="/register">📝 Register</Link>
          </div>
        )}
      </div>

      {/* 👋 Welcome Banner */}
      <div className="welcome-banner">
        <h1>🧾 Welcome to SmartReceipt AI</h1>
        <p>Upload your grocery receipt and get instant diet & health analysis. 🥗</p>
      </div>

      {/* 📤 Upload Section */}
      <div className="upload-section">
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handleUpload}>📤 Scan Receipt</button>
      </div>

      {/* 📊 Result Table */}
      {result && (
        <div className="result-table">
          <h2>📊 Diet Summary</h2>
          <div className="grid-table">
            {/* Category Headers */}
            <div className="grid-row header">
              {Object.keys(result.dietSummary).map((cat) => (
                <div key={cat} className="grid-cell">
                  {cat}
                </div>
              ))}
            </div>

            {/* Items per category */}
            <div className="grid-row">
              {Object.entries(getGroupedData()).map(([cat, items]) => (
                <div key={cat} className="grid-cell">
                  {items.map((item, idx) => (
                    <div key={idx}>{item.item}</div>
                  ))}
                </div>
              ))}
            </div>

            {/* Quantity row */}
            <div className="grid-row quantity">
              {Object.entries(getGroupedData()).map(([cat, items]) => (
                <div key={cat} className="grid-cell">
                  <strong>Qty:</strong> {items.length}
                </div>
              ))}
            </div>

            {/* Total price row */}
            <div className="grid-row total">
              {Object.entries(getGroupedData()).map(([cat, items]) => (
                <div key={cat} className="grid-cell">
                  <strong>Total:</strong> ₹
                  {items.reduce((sum, item) => sum + (item.price || 0), 0)}
                </div>
              ))}
            </div>
          </div>

          <h2>🏥 Health Evaluation</h2>
          <p className="health">{result.healthEvaluation}</p>
        </div>
      )}
    </div>
  );
};

export default ReceiptUpload;

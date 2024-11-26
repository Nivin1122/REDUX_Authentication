import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { adminLogin } from '../features/auth/adminAuthSlice';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, message } = useSelector((state) => state.adminAuth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(adminLogin({ username, password })).then((action) => {
      if (action.type === 'adminAuth/adminLogin/fulfilled') {
        navigate('/admin_home');
      }
    });
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Admin Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {message && <p className="login-message success">{message}</p>}
      {error && <p className="login-message error">{error}</p>}
    </div>
  );
};

export default AdminLogin;

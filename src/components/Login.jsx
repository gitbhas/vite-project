import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(username, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>User Management form</h2>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="submit-button">Sign In</button>
      </form>
    </div>
  );
};

export default Login;

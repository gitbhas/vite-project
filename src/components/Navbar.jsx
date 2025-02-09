import React from 'react';
import { useAuth } from './AuthContext';
// Using AWS logo image
import './Navbar.css';

const Navbar = () => {
  const { signOut } = useAuth();

  return (
    <nav className="navbar">
      <div className="logo-container">
        <div className="aws-logo">
          <span className="aws-text">AWS</span>
          <span className="aws-text-accent">Cloud Control</span>
        </div>
      </div>
      <button onClick={signOut} className="btn btn-secondary">
        Sign Out
      </button>
    </nav>
  );
};

export default Navbar;
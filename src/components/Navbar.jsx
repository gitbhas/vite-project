import React from 'react';
import { useAuth } from './AuthContext';
import awsLogo from '../assets/aws-logo.svg';

const Navbar = () => {
  const { signOut } = useAuth();

  return (
    <nav className="navbar">
      <img src={awsLogo} alt="AWS Logo" className="navbar-logo" />
      <button onClick={signOut} className="btn btn-secondary">
        Sign Out
      </button>
    </nav>
  );
};

export default Navbar;
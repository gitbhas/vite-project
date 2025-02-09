import React from 'react';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const { signOut } = useAuth();

  return (
    <nav className="navbar">
      <img src="/src/assets/aws-logo.svg" alt="AWS Logo" className="navbar-logo" />
      <button onClick={signOut} className="btn btn-secondary">
        Sign Out
      </button>
    </nav>
  );
};

export default Navbar;
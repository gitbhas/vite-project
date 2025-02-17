import React from 'react';
import ServerStart from './components/ServerStart';
import ServerStop from './components/ServerStop';
import SSMDocument from './components/SSMDocument';
import Login from './components/Login';
import { useAuth } from './components/AuthContext';
import './style.css';

const App = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">User Management form</div>
        <button onClick={signOut} className="logout-button">Sign Out</button>
      </nav>

      <div className="container">
        <div className="page-header">
          <h1 className="page-title">User Management Console</h1>
        </div>

        <div className="card-container">
          <ServerStart />
        </div>
      </div>
    </>
  );
};

export default App;

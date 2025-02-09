import React from 'react';
import ServerStart from './components/ServerStart';
import ServerStop from './components/ServerStop';
import Navbar from './components/Navbar';
import SSMDocument from './components/SSMDocument';
import Login from './components/Login';
import { useAuth } from './components/AuthContext';
import './style.css';
import './components/Button.css';
import { FaServer } from 'react-icons/fa';
import Breadcrumb from './components/Breadcrumb';

const App = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <img src="/src/assets/aws-logo.svg" alt="AWS Logo" className="navbar-logo" />
        <button onClick={signOut} className="btn btn-secondary">Sign Out</button>
      </nav>

      <main className="main-content">
        <Breadcrumb />
        <div className="page-header">
          <div className="page-header-content">
            <FaServer className="page-icon animated-icon" />
            <h1 className="page-title">Server Management Console</h1>
          </div>
        </div>

        <div className="server-cards">
          <div className="server-card">
            <ServerStart />
          </div>
          <div className="server-card">
            <ServerStop />
          </div>
          <div className="server-card">
            <SSMDocument />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
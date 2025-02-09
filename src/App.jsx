import React, { useState } from 'react';
import ServerStart from './components/ServerStart';
import ServerStop from './components/ServerStop';
import SSMDocument from './components/SSMDocument';
import './style.css';

const App = () => {
  const [error, setError] = useState(null);
  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">AWS Server Management</div>
      </nav>

      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Server Management Console</h1>
        </div>

        <div className="card-container">
          <ServerStart />
          <ServerStop />
          <SSMDocument />
        </div>
      </div>
    </>
  );
};

export default App;
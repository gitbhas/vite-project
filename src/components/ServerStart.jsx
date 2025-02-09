import React, { useState } from 'react';
import './ServerCard.css';
import './Loading.css';
import startIcon from '../assets/server-start.svg';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

const serverOptions = [
  'ddps-dev-ef01',
  'ddps-tst-ef01',
  'ddps-int-ef01',
  'ddps-prd-ef01',
  'prs-prd-ap01',
  'prs-tst-ap01',
  'prs-int-ap01'
];

const ServerStart = () => {
  const [server, setServer] = useState('');
  const [parameters, setParameters] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStartServer = async () => {
    if (!server) {
      setStatus('Please select a server');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}/start-server`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverName: server,
          parameters: parameters ? JSON.parse(parameters) : {}
        }),
      });

      const data = await response.json();
      setStatus(data.message || 'Server start initiated');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="card-header">
        <h2 className="card-title">
          <img src={startIcon} alt="" className="card-icon" />
          Start Server
        </h2>
      </div>
      <div className="card-body">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="serverSelect">Select Server</label>
            <select
              id="serverSelect"
              className="form-control form-select"
              value={server}
              onChange={(e) => setServer(e.target.value)}
              required
            >
              <option value="">Select a server</option>
              {serverOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>
              Start Parameters
              <div className="tooltip">ⓘ
                <span className="tooltiptext">Additional start parameters in JSON format</span>
              </div>
            </label>
            <input
              type="text"
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
              placeholder='{"key": "value"}'
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleStartServer}
          >
            Start Server
          </button>
        </form>
        {status && (
          <div className="status-bar">
            <span>{status}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerStart;
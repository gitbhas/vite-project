import React, { useState } from 'react';

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

const ServerStop = () => {
  const [server, setServer] = useState('');
  const [parameters, setParameters] = useState('');
  const [status, setStatus] = useState('');

  const handleStopServer = async () => {
    if (!server) {
      setStatus('Please select a server');
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINT}/stop-server`, {
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
      setStatus(data.message || 'Server stop initiated');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Stop Server</h2>
      </div>
      <div className="card-body">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="stopServerSelect">Select Server</label>
            <select
              id="stopServerSelect"
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
              Stop Parameters
              <div className="tooltip">ⓘ
                <span className="tooltiptext">Force stop: {`{"force": true}`}</span>
              </div>
            </label>
            <input
              type="text"
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
              placeholder='{"force": false}'
            />
          </div>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleStopServer}
          >
            Stop Server
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

export default ServerStop;
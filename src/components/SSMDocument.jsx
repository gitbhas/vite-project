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

const documentOptions = [
  'DDPS-Clear-S3FS-Cache',
  'ddps-s3fs-cache-prs'
];

const SSMDocument = () => {
  const [server, setServer] = useState('');
  const [document, setDocument] = useState('');
  const [parameters, setParameters] = useState('');
  const [status, setStatus] = useState('');

  const handleRunDocument = async () => {
    if (!server) {
      setStatus('Please select a server');
      return;
    }
    if (!document) {
      setStatus('Please select an SSM document');
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINT}/run-ssm-document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverName: server,
          documentName: document,
          parameters: parameters ? JSON.parse(parameters) : {}
        }),
      });

      const data = await response.json();
      setStatus(data.message || 'SSM document execution initiated');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Run SSM Document</h2>
      </div>
      <div className="card-body">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="ssmServerSelect">Target Server</label>
            <select
              id="ssmServerSelect"
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
            <label htmlFor="documentSelect">SSM Document</label>
            <select
              id="documentSelect"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              required
            >
              <option value="">Select a document</option>
              {documentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>
              Parameters
              <div className="tooltip">ⓘ
                <span className="tooltiptext">Document parameters in JSON format</span>
              </div>
            </label>
            <input
              type="text"
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
              placeholder='{"commands": ["echo Hello"]}'
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRunDocument}
          >
            Run SSM Document
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

export default SSMDocument;
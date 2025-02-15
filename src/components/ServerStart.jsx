import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState('create-ami');
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const [payload, setPayload] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const API_ENDPOINT = 'https://8usizd8fp0.execute-api.us-east-1.amazonaws.com/initial';

  const testApiConnection = async () => {
    try {
      await fetch(`${API_ENDPOINT}/${currentTab}`, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      });
      setApiStatus('connected');
    } catch (error) {
      console.error('API connection failed:', error);
      setApiStatus('disconnected');
    }
  };

  useEffect(() => {
    testApiConnection();
    const interval = setInterval(testApiConnection, 30000);
    return () => clearInterval(interval);
  }, [currentTab]);

  const switchTab = (tab) => {
    setCurrentTab(tab);
    setShowDocumentation(tab === 'documentation');
  };

  const sendRequest = async () => {
    try {
      setError(null);
      setResponse(null);

      // Validate JSON
      const parsedPayload = JSON.parse(payload);

      const response = await fetch(`${API_ENDPOINT}/${currentTab}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'omit',
        mode: 'cors',
        body: payload
      });

      const data = await response.json();
      
      // Create combined response
      const fullResponse = {
        input: parsedPayload,
        output: data,
        timestamp: new Date().toISOString(),
        endpoint: `${API_ENDPOINT}/${currentTab}`
      };
      
      setResponse(fullResponse);
      setPayload(''); // Clear input after successful submission
      
    } catch (error) {
      console.error('Request error:', error);
      setError(`Request failed: ${error.message}`);
    }
  };

  const getExampleJson = () => {
    switch(currentTab) {
      case 'create-ami':
        return {
          "bucket_name": "ddps-s301-v4nprd.admin",
          "object_key": "cloudformation/v4non-prd-silverami-template2.yml",
          "stack_name": "rhel8-silvami-lambda-v2",
          "ami_name": "rhel8-silver-img-011824",
          "imageId": "ami-0b5103cacdbf2e9bb"
        };
      case 'rebuild-prep':
        return {
          "instance_names": [
            "ddps-dev-ap01"
          ],
          "action": "start"
        };
      case 'server-rebuild':
        return {
          "instance_names": [
            "ddps-dev-ap01"
          ],
          "bucket_names": [
            "ddps-dev-v4-landing"
          ],
          "launch_template_names": [
            "ddps-dev-ap01-lt"
          ]
        };
      default:
        return {};
    }
  };

  return (
    <div>
      <div className="header">
        <div className="container">
          <h1>Server Management Console</h1>
        </div>
      </div>

      <div className="container">
        <div className="tabs">
          <div 
            className={`tab ${currentTab === 'create-ami' ? 'active' : ''}`}
            onClick={() => switchTab('create-ami')}
          >
            Create AMI
          </div>
          <div 
            className={`tab ${currentTab === 'rebuild-prep' ? 'active' : ''}`}
            onClick={() => switchTab('rebuild-prep')}
          >
            Rebuild Prep
          </div>
          <div 
            className={`tab ${currentTab === 'server-rebuild' ? 'active' : ''}`}
            onClick={() => switchTab('server-rebuild')}
          >
            Server Rebuild
          </div>
          <div 
            className={`tab ${currentTab === 'documentation' ? 'active' : ''}`}
            onClick={() => switchTab('documentation')}
          >
            Documentation
          </div>
        </div>

        {!showDocumentation ? (
          <div className="card">
            <div className="form-group">
              <label htmlFor="payload">JSON Payload:</label>
              <textarea
                id="payload"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                placeholder="Enter your JSON payload here..."
              />
            </div>

            <div className="form-group">
              <button onClick={sendRequest}>Execute Request</button>
            </div>

            {response && (
              <div className="response-container">
                <pre className="response">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            )}
            
            {error && (
              <div className="error">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="documentation-container card">
            <h2>API Documentation</h2>
            
            <div className="doc-section">
              <h3>Create AMI</h3>
              <div className="description">
                Creates an Amazon Machine Image (AMI) from the specified instance.
              </div>
              <pre className="json-example">
                {JSON.stringify(getExampleJson(), null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      <div className="status-container">
        <span className={`status-indicator status-${apiStatus}`} />
        <span id="status-text">
          {apiStatus === 'checking' && 'Checking API connection...'}
          {apiStatus === 'connected' && 'API Connected'}
          {apiStatus === 'disconnected' && 'API Disconnected'}
        </span>
      </div>
    </div>
  );
}

export default App;

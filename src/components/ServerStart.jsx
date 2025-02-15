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
  const API_KEY = "AmplifyCognitoAPI$24" //process.env.REACT_APP_API_KEY; // Add this line for API key

  const testApiConnection = async () => {
    try {
      await fetch(`${API_ENDPOINT}/${currentTab}`, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': API_KEY , // Add origin header// Add API key header
          'Origin': window.location.origin 
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
    setPayload('');
    setResponse(null);
    setError(null);
  };

  const sendRequest = async () => {
    try {
      setError(null);
      setResponse(null);

      // Check if API key is configured
      if (!API_KEY) {
        throw new Error('API key is not configured');
      }

      // Validate JSON
      const parsedPayload = JSON.parse(payload);

      const response = await fetch(`${API_ENDPOINT}/${currentTab}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Api-Key': API_KEY,  // Add API key header
          'Origin': window.location.origin
        },
        credentials: 'omit',
        mode: 'cors',
        body: payload
      });

      // Handle API key related errors
      if (response.status === 403) {
        throw new Error('Invalid API key or unauthorized access');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Create combined response
      const fullResponse = {
        input: parsedPayload,
        output: data,
        timestamp: new Date().toISOString(),
        endpoint: `${API_ENDPOINT}/${currentTab}`
      };
      
      setResponse(fullResponse);
      
    } catch (error) {
      console.error('Request error:', error);
      setError(`Request failed: ${error.message}`);
    }
  };

  const loadExamplePayload = () => {
    const example = getExampleJson();
    setPayload(JSON.stringify(example, null, 2));
  };

  const getExampleJson = () => {
    switch(currentTab) {
      case 'create-ami':
        return {
          bucket_name: "XXXXXXXXXXXXXXXXXXXXXX",
          object_key: "cloudformation/v4non-prd-silverami-template2.yml",
          stack_name: "rhel8-silvami-lambda-v2",
          ami_name: "rhel8-silver-img-011824",
          imageId: "ami-0b5103cacdbf2e9bb"
        };
      case 'rebuild-prep':
        return {
          instance_names: ["ddps-dev-ap01"],
          action: "start"
        };
      case 'server-rebuild':
        return {
          instance_names: ["ddps-dev-ap01"],
          bucket_names: ["ddps-dev-v4-landing"],
          launch_template_names: ["ddps-dev-ap01-lt"]
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
              <div className="textarea-container">
                <textarea
                  id="payload"
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  placeholder="Enter your JSON payload here..."
                />
                <button className="example-button" onClick={loadExamplePayload}>
                  Load Example
                </button>
              </div>
            </div>

            <div className="form-group">
              <button onClick={sendRequest} className="execute-button">Execute Request</button>
            </div>

            {response && (
              <div className="response-container">
                <h3>Response:</h3>
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
                Creates an Amazon Machine Image (AMI) from the specified instance. This endpoint handles the creation
                of AMIs using CloudFormation templates and specified parameters.
              </div>
              <h4>Request Format:</h4>
              <div className="json-example">
{`{
    "bucket_name": "ddps-s301-v4nprd.admin",
    "object_key": "cloudformation/v4non-prd-silverami-template2.yml",
    "stack_name": "rhel8-silvami-lambda-v2",
    "ami_name": "rhel8-silver-img-011824",
    "imageId": "ami-0b5103cacdbf2e9bb"
}`}
              </div>
              <div className="parameter-description">
                <p><strong>bucket_name:</strong> The S3 bucket containing the CloudFormation template</p>
                <p><strong>object_key:</strong> The path to the template file in the S3 bucket</p>
                <p><strong>stack_name:</strong> Name for the CloudFormation stack</p>
                <p><strong>ami_name:</strong> Name for the new AMI</p>
                <p><strong>imageId:</strong> Base AMI ID to use</p>
              </div>
            </div>

            <div className="doc-section">
              <h3>Rebuild Prep</h3>
              <div className="description">
                Prepares instances for rebuild by performing necessary backup operations and state management.
                This endpoint handles instance start/stop operations as part of the rebuild preparation process.
              </div>
              <h4>Request Format:</h4>
              <div className="json-example">
{`{
    "instance_names": [
        "ddps-dev-ap01"
    ],
    "action": "start"
}`}
              </div>
              <div className="parameter-description">
                <p><strong>instance_names:</strong> Array of EC2 instance names to prepare</p>
                <p><strong>action:</strong> Action to perform (start/stop)</p>
              </div>
            </div>

            <div className="doc-section">
              <h3>Server Rebuild</h3>
              <div className="description">
                Initiates the server rebuild process using specified parameters. This endpoint handles the complete
                rebuild process including backup verification and instance recreation.
              </div>
              <h4>Request Format:</h4>
              <div className="json-example">
{`{
    "instance_names": [
        "ddps-dev-ap01"
    ],
    "bucket_names": [
        "ddps-dev-v4-landing"
    ],
    "launch_template_names": [
        "ddps-dev-ap01-lt"
    ]
}`}
              </div>
              <div className="parameter-description">
                <p><strong>instance_names:</strong> Array of EC2 instance names to rebuild</p>
                <p><strong>bucket_names:</strong> Array of S3 bucket names for backup/restore</p>
                <p><strong>launch_template_names:</strong> Array of launch template names to use</p>
              </div>
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

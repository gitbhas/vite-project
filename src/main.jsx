import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
         // API Configuration - Replace with your API Gateway URL
        const API_ENDPOINT = 'https://3loz81r0bg.execute-api.us-east-1.amazonaws.com/initial';

        // Helper function to show success message
        function showSuccess(message) {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <span style="color: var(--aws-success); margin-right: 8px;">✓</span>
                    <span>${message}</span>
                </div>
            `;
            resultDiv.style.borderLeft = '4px solid var(--aws-success)';
        }

        // Helper function to show error message
        function showError(message) {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <span style="color: var(--aws-error); margin-right: 8px;">✕</span>
                    <span>${message}</span>
                </div>
            `;
            resultDiv.style.borderLeft = '4px solid var(--aws-error)';
        }

           // Start Server
// Start Server function
async function startServer() {
    const serverName = document.getElementById('serverSelect').value;
    if (!serverName) {
        showError('Please select a server');
        return;
    }

    const button = document.querySelector('#startServerForm button');
    button.disabled = true;

    try {
        showProcessing(`Processing request for ${serverName}...`);

        const response = await fetch(`${API_ENDPOINT}/start-server`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({ serverName: serverName })
        });

        // Get the response data
        const data = await response.json();
        console.log('Raw response:', data);

        // Parse the response
        const parsedResponse = parseLambdaResponse(data);
        console.log('Parsed response:', parsedResponse);

        // Display the actual message from Lambda, regardless of status code
        if (parsedResponse && parsedResponse.message) {
            if (response.ok) {
                showSuccess(parsedResponse.message);
            } else {
                showError(parsedResponse.message);
            }
        } else {
            showError('Unknown error occurred');
        }
    } catch (error) {
        console.error('Error:', error);
        showError(`Failed to process request: ${error.message}`);
    } finally {
        button.disabled = false;
    }
}

// Helper function to parse Lambda response
function parseLambdaResponse(data) {
    try {
        // If data is a string, try to parse it
        if (typeof data === 'string') {
            return JSON.parse(data);
        }
        
        // If data.body exists and is a string, parse it
        if (data.body && typeof data.body === 'string') {
            return JSON.parse(data.body);
        }
        
        // If data.body is already an object, return it
        if (data.body && typeof data.body === 'object') {
            return data.body;
        }
        
        // If data itself has a message, return data
        if (data.message) {
            return data;
        }
        
        return data;
    } catch (e) {
        console.error('Error parsing response:', e);
        return {
            message: 'Error parsing server response',
            error: e.message
        };
    }
}

// Status display functions
function showProcessing(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div style="display: flex; align-items: center;">
            <span style="color: var(--aws-light-blue); margin-right: 8px;">⟳</span>
            <span>${message}</span>
        </div>
    `;
    resultDiv.style.borderLeft = '4px solid var(--aws-light-blue)';
}

function showSuccess(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div style="display: flex; align-items: center;">
            <span style="color: var(--aws-success); margin-right: 8px;">✓</span>
            <span>${message}</span>
        </div>
    `;
    resultDiv.style.borderLeft = '4px solid var(--aws-success)';
}

function showError(message) {
    const resultDiv = document.getElementById('result');
    // Clean up the error message if it contains HTTP error
    const cleanMessage = message.replace('Failed to start server: HTTP error! status: 400', '');
    resultDiv.innerHTML = `
        <div style="display: flex; align-items: center;">
            <span style="color: var(--aws-error); margin-right: 8px;">✕</span>
            <span>${cleanMessage || message}</span>
        </div>
    `;
    resultDiv.style.borderLeft = '4px solid var(--aws-error)';
}


// Updated Stop Server function
async function stopServer() {
    const serverName = document.getElementById('stopServerSelect').value;
    if (!serverName) {
        showError('Please select a server');
        return;
    }

    const button = document.querySelector('#stopServerForm button');
    button.disabled = true;

    try {
        showProcessing(`Processing request for ${serverName}...`);

        const response = await fetch(`${API_ENDPOINT}/stop-server`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({ serverName: serverName })
        });

        // Get the response data
        const data = await response.json();
        console.log('Raw response:', data);

        // Parse the response
        const parsedResponse = parseLambdaResponse(data);
        console.log('Parsed response:', parsedResponse);

        // Display the actual message from Lambda, regardless of status code
        if (parsedResponse && parsedResponse.message) {
            if (response.ok) {
                showSuccess(parsedResponse.message);
            } else {
                showError(parsedResponse.message);
            }
        } else {
            showError('Unknown error occurred');
        }
    } catch (error) {
        console.error('Error:', error);
        showError(`Failed to process request: ${error.message}`);
    } finally {
        button.disabled = false;
    }
}

// Helper function to parse Lambda response
function parseLambdaResponse(data) {
    try {
        // If data is a string, try to parse it
        if (typeof data === 'string') {
            return JSON.parse(data);
        }
        
        // If data.body exists and is a string, parse it
        if (data.body && typeof data.body === 'string') {
            return JSON.parse(data.body);
        }
        
        // If data.body is already an object, return it
        if (data.body && typeof data.body === 'object') {
            return data.body;
        }
        
        // If data itself has a message, return data
        if (data.message) {
            return data;
        }
        
        return data;
    } catch (e) {
        console.error('Error parsing response:', e);
        return {
            message: 'Error parsing server response',
            error: e.message
        };
    }
}


        // Run SSM Document
        function runSSMDocument() {
            const serverName = document.getElementById('ssmServerSelect').value;
            const documentName = document.getElementById('documentSelect').value;
            const parameters = document.getElementById('parameters').value;

            if (!serverName || !documentName) {
                showError('Please select both server and SSM document');
                return;
            }

            // Show loading state
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `Processing: Running ${documentName} on ${serverName}...`;
            resultDiv.style.borderLeft = '4px solid var(--aws-light-blue)';

            fetch(`${API_ENDPOINT}/run-ssm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    serverName: serverName,
                    documentName: documentName,
                    parameters: parameters ? JSON.parse(parameters) : {}
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Raw response:', data); // For debugging
                if (data.body) {
                    try {
                        const bodyData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
                        showSuccess(bodyData.message || `SSM document execution initiated successfully`);
                    } catch (e) {
                        showSuccess(data.body);
                    }
                } else {
                    showSuccess(data.message || `SSM document execution initiated successfully`);
                }
            })
            .catch(error => {
                showError(`Failed to run SSM document: ${error.message}`);
                console.error('Error:', error);
            });
        }
// Add this function after your other JavaScript code
function testApiConnection() {
    console.log('Testing API connection...');
    fetch(`${API_ENDPOINT}/start-server`, {
        method: 'OPTIONS',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('CORS pre-flight response:', response);
        showSuccess('API connection successful');
    })
    .catch(error => {
        console.error('API connection  failed:', error);
        showError(`API connection failed: ${error.message}`);
    });
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('API Endpoint:', API_ENDPOINT);
    testApiConnection();
});
`

//setupCounter(document.querySelector('#counter'))

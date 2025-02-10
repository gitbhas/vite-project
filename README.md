# Server Management Console

The Server Management Console is a React-based web application that provides a user-friendly interface for managing servers and executing AWS Systems Manager (SSM) documents.

This project offers a centralized platform for starting and stopping servers, as well as running SSM documents on specified target servers. It integrates with AWS services, including AWS Amplify for authentication and API Gateway for backend communication.

## Repository Structure

The repository is organized as follows:

- `src/`: Contains the main source code for the React application
  - `components/`: React components used throughout the application
  - `App.jsx`: Main application component
  - `main.jsx`: Entry point of the application
- `amplify.yml`: AWS Amplify build configuration
- `vite.config.js`: Vite build configuration
- `package.json`: Project dependencies and scripts
- `tsconfig.json` and `tsconfig.node.json`: TypeScript configuration files

Key files:
- `src/App.jsx`: Main application component that renders the server management interface
- `src/components/ServerStart.jsx`: Component for starting servers
- `src/components/ServerStop.jsx`: Component for stopping servers
- `src/components/SSMDocument.jsx`: Component for running SSM documents

## Usage Instructions

### Installation

Prerequisites:
- Node.js (v14.18.0 or higher)
- npm (v6.14.0 or higher)

To install the project dependencies, run:

```bash
npm ci
```

### Getting Started

To start the development server, run:

```bash
npm run dev
```

This will start the Vite development server, and you can access the application in your browser.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

This will create a `dist` directory with the compiled assets.

### Configuration

The application requires the following environment variables:

- `VITE_API_ENDPOINT`: The API endpoint for server management operations

You can set these variables in a `.env` file in the root of the project.

### Common Use Cases

1. Starting a Server:
   - Select a server from the dropdown in the "Start Server" card
   - Optionally, provide start parameters in JSON format
   - Click the "Start Server" button

2. Stopping a Server:
   - Select a server from the dropdown in the "Stop Server" card
   - Optionally, provide stop parameters (e.g., `{"force": true}` for force stop)
   - Click the "Stop Server" button

3. Running an SSM Document:
   - Select a target server from the dropdown
   - Choose an SSM document from the available options
   - Provide any necessary parameters in JSON format
   - Click the "Run SSM Document" button

### Troubleshooting

Common issues and solutions:

1. API Connection Errors:
   - Problem: Unable to connect to the API endpoint
   - Solution: 
     1. Verify that the `VITE_API_ENDPOINT` environment variable is correctly set
     2. Check your network connection
     3. Ensure that the API Gateway and associated Lambda functions are properly configured and running

2. Authentication Issues:
   - Problem: Unable to log in or access protected routes
   - Solution:
     1. Verify that AWS Amplify is correctly configured with your Cognito User Pool
     2. Check the browser console for any specific error messages
     3. Ensure that your Cognito User Pool is properly set up and the user exists

3. SSM Document Execution Failures:
   - Problem: SSM documents fail to execute on target servers
   - Solution:
     1. Verify that the target server is running and accessible
     2. Check that the IAM roles associated with the target servers have the necessary permissions to execute SSM documents
     3. Review the SSM document parameters for any formatting issues or missing required fields

For debugging:
- Enable verbose logging by setting `VITE_DEBUG=true` in your `.env` file
- Check the browser console for detailed error messages and API responses
- Review AWS CloudWatch logs for the associated Lambda functions and API Gateway

## Data Flow

The Server Management Console follows this high-level data flow:

1. User authenticates using AWS Amplify (Cognito)
2. User interacts with the UI to start/stop servers or run SSM documents
3. React components make API calls to the configured API endpoint
4. API Gateway receives the requests and triggers the appropriate Lambda functions
5. Lambda functions interact with AWS services (EC2, Systems Manager) to perform the requested actions
6. Results are returned through the API Gateway to the frontend
7. React components update the UI with the operation status

```
[User] <-> [React Frontend] <-> [API Gateway] <-> [Lambda Functions] <-> [AWS Services (EC2, SSM)]
```

Note: Ensure proper IAM roles and permissions are set up for the Lambda functions to interact with EC2 and Systems Manager services.

## Deployment

The application is configured for deployment using AWS Amplify. The `amplify.yml` file defines the build and deployment process:

1. Install dependencies using `npm ci`
2. Build the application using `npm run build`
3. Deploy the contents of the `dist` directory

To deploy:
1. Set up an Amplify project and link it to your repository
2. Configure the necessary environment variables in the Amplify console
3. Trigger a deployment manually or through your CI/CD pipeline

## Infrastructure

The project uses the following AWS resources:

- AWS Amplify: Hosts and deploys the React frontend application
- Amazon Cognito: Manages user authentication
- API Gateway: Provides the API endpoint for server management operations
- Lambda: Executes the backend logic for server management and SSM document execution
- EC2: Target servers managed by the application
- Systems Manager: Executes SSM documents on target servers

Ensure that all necessary IAM roles and permissions are properly configured for these services to interact securely.
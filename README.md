# AWS Amplify Authentication Integration

This project has been updated to include AWS Amplify authentication. To complete the setup:

1. Install dependencies:
```bash
npm install
```

2. Configure Amplify:
   - Update the `aws-exports.js` file with your AWS Cognito User Pool details:
     - `aws_user_pools_id`: Your Cognito User Pool ID
     - `aws_user_pools_web_client_id`: Your App Client ID

3. Run the development server:
```bash
npm run dev
```

## Features
- User authentication with AWS Cognito
- Protected routes requiring authentication
- Login form with error handling
- Sign out functionality
- Loading state handling

## Implementation Details
- Uses AWS Amplify for authentication
- React Context API for auth state management
- Protected server management features behind authentication
- Responsive styling for login and logout components
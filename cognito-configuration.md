# Cognito Configuration for Email Authentication

## Current Issue
The application is receiving a 400 (Bad Request) error when attempting to authenticate with Cognito. This typically occurs when there's a mismatch between the authentication configuration and the Cognito User Pool settings.

## Required Cognito User Pool Configuration

To resolve the 400 error, ensure the following configurations are set in your Cognito User Pool (us-east-1_8Y2ZD07f1):

1. **Sign-in options**:
   - Enable "Email address or phone number"
   - Select "Allow email addresses"
   - Enable "User name"

2. **Required attributes**:
   - Add "email" as a required attribute

3. **Password policy**:
   - Configure according to your security requirements
   - Ensure it matches the format of passwords being used in testing

4. **App client settings** (for client ID: 3ij75agq13fhrq34fhqequsn5b):
   - Enable "USER_PASSWORD_AUTH" flow
   - Enable "ALLOW_USER_PASSWORD_AUTH" in App client OAuth 2.0 settings

## Steps to Update Configuration

1. Go to AWS Console > Cognito > User Pools
2. Select pool "us-east-1_8Y2ZD07f1"
3. Under "App integration", select the app client
4. Enable the authentication flows mentioned above
5. Under "Sign-in experience", update the sign-in options
6. Save all changes

## Code Compatibility

The current code implementation will work correctly once these Cognito configurations are in place. The code is properly structured to:
- Use email as the username field
- Handle authentication errors appropriately
- Use the correct authentication flow

## Testing After Configuration

After updating the Cognito configuration:
1. Create a test user through the Cognito console
2. Confirm the email
3. Try logging in with the email address and password
4. Monitor browser network tab for successful authentication
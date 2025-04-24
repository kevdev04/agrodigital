# AWS Cognito Setup Guide

This guide will help you set up AWS Cognito authentication for your AgroDigital application.

## Prerequisites

1. AWS account with appropriate permissions
2. AWS CLI installed and configured (optional for convenience)
3. AWS Amplify CLI installed (optional for convenience)

## Step 1: Create a Cognito User Pool

1. Sign in to the AWS Management Console
2. Navigate to the Cognito service
3. Click "Create user pool"
4. Configure sign-in options:
   - Select "Email" as a required attribute
   - Allow users to sign in with "Username"
   - Allow users to sign in with email (optional)
   - Allow users to sign in with phone number (recommended)

5. Configure security requirements:
   - Set password policy as needed (we recommend allowing multi-factor authentication)
   - Enable self-service account recovery

6. Configure sign-up experience:
   - Required attributes: name, email, phone_number
   - Custom attributes: 
     - custom:address (String)
     - custom:birthState (String)
     - custom:birthDate (String)
     - custom:gender (String)

7. Configure message delivery:
   - Set up email and SMS services (SES, SNS)

8. Integrate your app:
   - Create an app client
   - Do NOT select "Generate client secret" since we're using a public client
   - Set appropriate callback URLs

9. Review and create the user pool

## Step 2: Configure Your App

1. Copy the .env.example file to .env:
   ```
   cp .env.example .env
   ```

2. Open the .env file and update it with your Cognito information:
   ```
   EXPO_PUBLIC_AWS_REGION=us-east-1  # Your actual region
   EXPO_PUBLIC_AWS_USER_POOL_ID=us-east-1_xxxxxxxx  # Your actual pool ID
   EXPO_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx  # Your actual client ID
   ```

3. Set `EXPO_PUBLIC_USE_COGNITO=true` in your .env file to enable Cognito authentication

The aws-exports.js file will automatically use these environment variables.

## Step 3: Git Repository Configuration

For security when pushing to a repository:

1. The `.env` file is already added to the `.gitignore` file to prevent accidentally pushing your credentials.
2. The `.env.example` file is included in the repository as a template, but doesn't contain real credentials.
3. Never commit actual credentials to the repository.

When collaborating with others:
- Each developer should create their own local `.env` file based on `.env.example`
- For deployment environments, set environment variables in your CI/CD pipeline or hosting platform

## Step 4: Configure User Pool Attributes

For our application, we need some custom attributes. In the AWS Console:

1. Navigate to your User Pool
2. Go to "User Pool Properties" 
3. Under "Attributes", click "Add custom attributes"
4. Add the following:
   - custom:address (String)
   - custom:birthState (String)
   - custom:birthDate (String)
   - custom:gender (String)

## Step 5: Testing Authentication

1. Run your app with Cognito enabled:
   ```
   npm start
   ```

2. Register a new user through the app
3. Verify that the confirmation code process works
4. Test sign-in with the user

## Security Considerations

1. **Never expose your AWS credentials in your code**
2. Consider using AWS Amplify's built-in UI components for auth in production
3. For production, setup proper IAM roles and policies
4. Enable MFA for enhanced security
5. Monitor user activity through CloudWatch
6. Setup CloudTrail for auditing

## Troubleshooting

1. If you encounter CORS issues, check your Cognito app client settings
2. For SMS delivery issues, ensure your AWS account has SNS permissions
3. Check your app's network requests for detailed error messages
4. Verify your .env and aws-exports.js settings match your Cognito configuration

## References

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [AWS Amplify Authentication](https://docs.amplify.aws/lib/auth/getting-started/)
- [React Native AWS SDK](https://github.com/aws-amplify/amplify-js) 
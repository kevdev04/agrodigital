// AWS Cognito Configuration
// WARNING: Do not hardcode real credentials here!
// Use environment variables through .env file
const awsConfig = {
  Auth: {
    // Use environment variables if available, otherwise use placeholders
    region: process.env.EXPO_PUBLIC_AWS_REGION || 'YOUR_REGION', 
    userPoolId: process.env.EXPO_PUBLIC_AWS_USER_POOL_ID || 'YOUR_USER_POOL_ID',
    userPoolWebClientId: process.env.EXPO_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID || 'YOUR_CLIENT_ID',
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  }
};

// Log a warning if using placeholder values (in development only)
if (__DEV__ && (!process.env.EXPO_PUBLIC_AWS_REGION || 
    !process.env.EXPO_PUBLIC_AWS_USER_POOL_ID || 
    !process.env.EXPO_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID)) {
  console.warn(
    'AWS Cognito configuration is using placeholder values. ' +
    'Please set up your .env file with your AWS Cognito credentials.'
  );
}

export default awsConfig; 
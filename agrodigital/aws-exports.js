// AWS Cognito Configuration
const awsConfig = {
  Auth: {
    region: process.env.EXPO_PUBLIC_AWS_REGION || 'YOUR_REGION', 
    userPoolId: process.env.EXPO_PUBLIC_AWS_USER_POOL_ID || 'YOUR_USER_POOL_ID',
    userPoolWebClientId: process.env.EXPO_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID || 'YOUR_CLIENT_ID',
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  }
};

export default awsConfig; 
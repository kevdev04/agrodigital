// AWS Cognito Configuration
const awsConfig = {
  Auth: {
    region: 'YOUR_REGION', // e.g., 'us-east-1'
    userPoolId: 'YOUR_USER_POOL_ID',
    userPoolWebClientId: 'YOUR_CLIENT_ID',
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  }
};

export default awsConfig; 
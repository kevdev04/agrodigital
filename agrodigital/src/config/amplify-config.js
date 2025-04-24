import { Amplify } from 'aws-amplify';
import { 
  AWS_REGION, 
  AWS_USER_POOL_ID, 
  AWS_USER_POOL_WEB_CLIENT_ID 
} from '@env';

const amplifyConfig = {
  Auth: {
    // Retrieve from environment variables
    region: AWS_REGION,
    userPoolId: AWS_USER_POOL_ID,
    userPoolWebClientId: AWS_USER_POOL_WEB_CLIENT_ID,
    
    // Authentication mechanisms
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    
    // Additional settings
    mandatorySignIn: true,
    mfaConfiguration: 'OPTIONAL'
  }
};

// Initialize Amplify with the secure configuration
Amplify.configure(amplifyConfig);

// Export the configured Amplify instance
export default Amplify; 
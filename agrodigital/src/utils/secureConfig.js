import * as SecureStore from 'expo-secure-store';
import { Amplify } from 'aws-amplify';

// Keys for storing credentials
const KEYS = {
  REGION: 'aws_region',
  USER_POOL_ID: 'aws_user_pool_id',
  CLIENT_ID: 'aws_client_id',
};

// Initialize with default values (only for development - replace in production)
const initializeSecureCredentials = async () => {
  // Check if credentials are already stored
  const hasCredentials = await SecureStore.getItemAsync(KEYS.CLIENT_ID);
  
  if (!hasCredentials) {
    // Store the credentials securely
    await SecureStore.setItemAsync(KEYS.REGION, 'us-east-1');
    await SecureStore.setItemAsync(KEYS.USER_POOL_ID, 'us-east-1_BdpEXorzf');
    await SecureStore.setItemAsync(KEYS.CLIENT_ID, '3g8i1ic7s3bm5pq7pv8e01dn6j');
    console.log('Credentials stored securely');
  }
};

// Configure Amplify with secure credentials
const configureAmplify = async () => {
  try {
    // Get credentials from secure storage
    const region = await SecureStore.getItemAsync(KEYS.REGION);
    const userPoolId = await SecureStore.getItemAsync(KEYS.USER_POOL_ID);
    const userPoolWebClientId = await SecureStore.getItemAsync(KEYS.CLIENT_ID);
    
    // Configure Amplify with retrieved credentials
    Amplify.configure({
      Auth: {
        region,
        userPoolId,
        userPoolWebClientId,
        authenticationFlowType: 'USER_PASSWORD_AUTH',
      }
    });
    
    console.log('Amplify configured with secure credentials');
    return true;
  } catch (error) {
    console.error('Error configuring Amplify:', error);
    return false;
  }
};

// Export the utility functions
export { initializeSecureCredentials, configureAmplify }; 
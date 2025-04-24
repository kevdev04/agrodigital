import { Amplify } from 'aws-amplify';

// Amplify Gen 2 Configuration
export const configureAmplify = () => {
  Amplify.configure({
    Auth: {
      Cognito: {
        // Replace with your actual values from AWS Amplify Console
        userPoolId: 'us-east-1_zAK32fD5c',
        userPoolClientId: '259f9lgt6k1rh6tdp28u9qeto3',
        region: 'us-east-1',
      }
    }
  });
}; 
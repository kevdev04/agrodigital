import { Amplify } from 'aws-amplify';

// Amplify Gen 1 Configuration
export const configureAmplify = () => {
  Amplify.configure({
    Auth: {
      // Replace with your actual values from AWS Amplify Console
      region: 'us-east-1',
      userPoolId: 'us-east-1_BdpEXorzf',
      userPoolWebClientId: '3g8i1ic7s3bm5pq7pv8e01dn6j'
    }
  });
}; 
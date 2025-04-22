# AWS Amplify Deployment Guide

This guide will walk you through deploying this Expo/React Native app to AWS Amplify with continuous deployment for web, iOS, and Android platforms.

## Prerequisites

1. An AWS account
2. Your code in a Git repository (GitHub, BitBucket, or GitLab)
3. An Expo account (sign up at https://expo.dev)
4. Apple Developer account (for iOS builds)
5. Google Play Developer account (for Android builds)

## Pre-Deployment Setup

### 1. Configure your app.json

Update the following in your app.json:
- For iOS: Replace `com.yourdomain.agrodigital` with your actual bundle identifier
- For Android: Replace `com.yourdomain.agrodigital` with your actual package name

### 2. Initialize EAS

Run the following commands:

```bash
cd agrodigital
npm install -g eas-cli
eas login
eas build:configure
```

After running `eas build:configure`, copy the generated projectId to your app.json in the `expo.extra.eas.projectId` field.

### 3. Set up credentials

For iOS:
```bash
eas credentials
```

For Android, follow the instructions to generate a keystore.

## Deployment Steps

### 1. Prepare your repository

Make sure your repository includes:
- The `amplify.yml` file at the root (already added)
- The `eas.json` file in the agrodigital directory (already added)
- Updated app.json with bundle identifiers (already configured)

### 2. Log in to AWS Console and navigate to Amplify

1. Go to https://console.aws.amazon.com/amplify/
2. Click "Create new app"

### 3. Connect your repository

1. Choose your Git provider (GitHub, BitBucket, or GitLab)
2. Authorize AWS Amplify to access your repositories
3. Select the repository containing this project
4. Select the branch you want to deploy (e.g., main)

### 4. Configure build settings

1. In the "App build specification" section, Amplify should automatically detect the `amplify.yml` file
2. You can review the build settings and make any necessary adjustments

### 5. Configure Expo credentials for CI/CD

1. Generate access tokens for EAS:
   ```bash
   eas secret:create --scope project --name EXPO_TOKEN --value $(eas whoami --json | jq -r '.accessToken')
   ```

2. In Amplify Console under "Environment variables", add:
   - Key: `EXPO_TOKEN`
   - Value: Your Expo token from step 1

### 6. Review and deploy

1. Review your settings
2. Click "Save and deploy"

## Continuous Deployment

AWS Amplify will automatically:
1. Watch for new commits to your repository
2. Trigger a new build and deployment whenever changes are pushed
3. Deploy the updated web app
4. Trigger mobile builds for iOS and Android

## Testing Mobile Builds

After deployment, you can monitor your mobile builds in the Expo dashboard at https://expo.dev.

## Custom Domain Setup (Optional)

1. In the Amplify Console, go to "Domain management"
2. Click "Add domain"
3. Follow the steps to verify and configure your domain

## Troubleshooting

If you encounter issues with the build or deployment:
1. Check the build logs in the Amplify Console
2. Verify your `amplify.yml` configuration
3. Check your EAS build status at https://expo.dev
4. Ensure your app builds correctly locally with:
   ```bash
   npm run web:build
   eas build --platform ios --local
   eas build --platform android --local
   ```

## Additional Resources

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
- [Expo EAS Documentation](https://docs.expo.dev/eas/)
- [Expo Web Documentation](https://docs.expo.dev/workflows/web/) 
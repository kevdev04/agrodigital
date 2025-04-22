# AWS Amplify Deployment Guide

This guide will walk you through deploying this Expo/React Native app to AWS Amplify with continuous deployment.

## Prerequisites

1. An AWS account
2. Your code in a Git repository (GitHub, BitBucket, or GitLab)
3. AWS CLI installed (optional, for troubleshooting)

## Deployment Steps

### 1. Prepare your repository

Make sure your repository includes:
- The `amplify.yml` file at the root (already added)
- The `web:build` script in package.json (already added)

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

### 5. Configure advanced settings (optional)

1. Under "Advanced settings", you can:
   - Set environment variables if needed
   - Configure custom domains
   - Set up access control
   - Configure build notifications

### 6. Review and deploy

1. Review your settings
2. Click "Save and deploy"

## Continuous Deployment

AWS Amplify will automatically:
1. Watch for new commits to your repository
2. Trigger a new build and deployment whenever changes are pushed
3. Deploy the updated app

## Custom Domain Setup (Optional)

1. In the Amplify Console, go to "Domain management"
2. Click "Add domain"
3. Follow the steps to verify and configure your domain

## Troubleshooting

If you encounter issues with the build or deployment:
1. Check the build logs in the Amplify Console
2. Verify your `amplify.yml` configuration
3. Ensure your app builds correctly locally with `npm run web:build`

## Additional Resources

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
- [Expo Web Documentation](https://docs.expo.dev/workflows/web/) 
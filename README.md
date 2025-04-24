# AgroDigital Mobile App

This repository contains the source code for the AgroDigital mobile application, built using React Native and Expo.

## Overview

AgroDigital is a mobile application likely designed for the agricultural sector. Based on the project structure and dependencies, its features may include:

*   Displaying agricultural data (potentially fetched from external APIs).
*   User interactions through custom components.
*   Location-based services (e.g., mapping fields, tracking).
*   Handling media like images or videos (e.g., uploading field pictures).
*   Integration with a backend system (possibly AWS Amplify) for data storage and APIs.

## Project Structure

The core application code resides within the `agrodigital/` directory:

```
agrodigital/
├── app/              # Main application screens and navigation (using expo-router)
├── assets/           # Static assets (images, fonts)
├── components/       # Reusable React Native components
├── constants/        # Application-wide constants (colors, styles)
├── hooks/            # Custom React Hooks
├── api/              # API interaction logic
├── backend/          # Backend integration code (e.g., Amplify configuration)
├── scripts/          # Utility scripts
├── node_modules/     # Project dependencies
├── .gitignore        # Git ignore rules specific to the app
├── app.json          # Expo configuration file
├── eas.json          # Expo Application Services (EAS) build configuration
├── package.json      # NPM dependencies and scripts
├── package-lock.json # Exact dependency versions
├── README.md         # (This file - potentially outdated starter)
└── tsconfig.json     # TypeScript configuration
```

## Technologies Used

*   **Framework:** React Native
*   **Development Environment:** Expo SDK (~52)
*   **Language:** TypeScript
*   **Navigation:** Expo Router
*   **UI Components:** `@expo/vector-icons`, `lucide-react-native`, `expo-linear-gradient`, etc.
*   **Native Features:** `expo-location`, `expo-image-picker`, `expo-av`, `expo-secure-store`
*   **Backend Integration:** Likely AWS Amplify (inferred from root `amplify.yml`)
*   **Build Service:** Expo Application Services (EAS)

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn
*   Expo CLI: `npm install -g expo-cli`
*   Git

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd agrodigital
    ```

2.  **Install dependencies:**
    Navigate into the application directory and install dependencies:
    ```bash
    cd agrodigital
    npm install
    ```
    *(Note: If you encounter issues, try deleting `node_modules` and `package-lock.json` and running `npm install` again.)*

3.  **Start the development server:**
    ```bash
    npx expo start
    ```

4.  **Run the app:**
    Follow the instructions in the terminal output to open the app:
    *   On an Android Emulator/Device
    *   On an iOS Simulator/Device
    *   In Expo Go (limited functionality)
    *   In a web browser (`npx expo start --web`)

## Available Scripts (within `agrodigital/` directory)

*   `npm start`: Starts the Expo development server.
*   `npm run android`: Starts the app on a connected Android device or emulator.
*   `npm run ios`: Starts the app on an iOS simulator or device.
*   `npm run web`: Starts the app in a web browser.
*   `npm run web:build`: Creates a production web build.
*   `npm run test`: Runs tests using Jest.
*   `npm run lint`: Lints the codebase using Expo's lint configuration.
*   `npm run reset-project`: (From default template) Moves starter code to `app-example` and creates a blank `app` directory. Use with caution.

## Deployment

This project appears configured for deployment using AWS Amplify (see `amplify.yml` and `AMPLIFY_DEPLOYMENT.md` in the root). Refer to those files and AWS Amplify documentation for deployment details. Builds for native platforms can be managed using EAS Build (configured in `eas.json`).

## Contributing

(Add contribution guidelines here if applicable)

## License

This project is licensed under the [LICENSE](./LICENSE) file.

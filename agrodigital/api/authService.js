import { Auth } from 'aws-amplify';
import awsConfig from '../aws-exports';
import { Amplify } from 'aws-amplify';

// Initialize Amplify with the configuration
Amplify.configure(awsConfig);

/**
 * Service for authentication with AWS Cognito
 */
export const authService = {
    /**
     * Register a new user with Cognito
     * @param {Object} userData - User data for registration
     * @returns {Promise} - Promise with the response
     */
    register: async (userData) => {
        try {
            // Register the user with Cognito
            const result = await Auth.signUp({
                username: userData.username, // Non-email format username
                password: userData.password,
                attributes: {
                    email: userData.email,
                    phone_number: userData.phone,
                    name: userData.fullName,
                    // Add custom attributes if needed for address, birthState, etc.
                    'custom:address': userData.address,
                    'custom:birthState': userData.birthState,
                    'custom:birthDate': userData.birthDate,
                    'custom:gender': userData.gender,
                }
            });
            
            return result;
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    },

    /**
     * Confirm signup with verification code
     * @param {string} username - Username (non-email format)
     * @param {string} code - Verification code sent to user's phone/email
     * @returns {Promise} - Promise with confirmation result
     */
    confirmSignUp: async (username, code) => {
        try {
            return await Auth.confirmSignUp(username, code);
        } catch (error) {
            console.error('Error confirming signup:', error);
            throw error;
        }
    },

    /**
     * Sign in a user
     * @param {string} username - Username (non-email format)
     * @param {string} password - User's password
     * @returns {Promise} - Promise with sign in result
     */
    signIn: async (username, password) => {
        try {
            return await Auth.signIn(username, password);
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    },

    /**
     * Sign out the current user
     * @returns {Promise} - Promise with sign out result
     */
    signOut: async () => {
        try {
            return await Auth.signOut();
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    },

    /**
     * Get the current authenticated user
     * @returns {Promise} - Promise with current user
     */
    getCurrentUser: async () => {
        try {
            return await Auth.currentAuthenticatedUser();
        } catch (error) {
            console.error('Error getting current user:', error);
            throw error;
        }
    },

    /**
     * Get the current user's attributes
     * @returns {Promise} - Promise with user attributes
     */
    getCurrentUserAttributes: async () => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            return await Auth.userAttributes(user);
        } catch (error) {
            console.error('Error getting user attributes:', error);
            throw error;
        }
    },

    /**
     * Forgot password flow - request code
     * @param {string} username - Username for password reset
     * @returns {Promise} - Promise with result
     */
    forgotPassword: async (username) => {
        try {
            return await Auth.forgotPassword(username);
        } catch (error) {
            console.error('Error in forgot password flow:', error);
            throw error;
        }
    },

    /**
     * Forgot password flow - submit code and new password
     * @param {string} username - Username for password reset
     * @param {string} code - Verification code
     * @param {string} newPassword - New password
     * @returns {Promise} - Promise with result
     */
    forgotPasswordSubmit: async (username, code, newPassword) => {
        try {
            return await Auth.forgotPasswordSubmit(username, code, newPassword);
        } catch (error) {
            console.error('Error submitting new password:', error);
            throw error;
        }
    }
};

import apiClient from './client';

export const authService = {
    register: async (userData) => {
        return apiClient.post('/auth/register', userData);
    },

    login: async (email, password) => {
        return apiClient.post('/auth/login', { email, password });
    },

    // otros métodos de autenticación
};

// agrodigital/api/userService.js
import apiClient from './client';

export const userService = {
    getProfile: async () => {
        return apiClient.get('/users/profile');
    },

    updateProfile: async (profileData) => {
        return apiClient.put('/users/profile', profileData);
    },

    // otros métodos de usuario
};

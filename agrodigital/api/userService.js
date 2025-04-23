import apiClient from './client';

// API Endpoints
const API_BASE = '/auth';
const API_USERS = '/users';

/**
 * Servicio para gestionar usuarios y autenticación
 */
export const userService = {
    /**
     * Registra un nuevo usuario
     * @param {Object} userData - Datos del usuario para registro
     * @returns {Promise} - Promesa con la respuesta
     */
    register: (userData) => {
        // Asegurarse de que los datos estén en el formato que espera el backend
        const formattedData = {
            userId: userData.userId,
            email: userData.email,
            password: userData.password,
            name: userData.fullName,
            phone: userData.phone,
            address: userData.address,
            birthState: userData.birthState,
            birthDate: userData.birthDate,
            gender: userData.gender,
            createdAt: userData.createdAt || new Date().toISOString(),
            status: 'ACTIVE'
        };

        console.log('Datos formateados para el backend:', formattedData);
        return apiClient.post(`${API_BASE}/register`, formattedData);
    },

    /**
     * Inicia sesión de usuario
     * @param {Object} credentials - Credenciales (email, password)
     * @returns {Promise} - Promesa con la respuesta que incluye el token
     */
    login: (credentials) => {
        return apiClient.post(`${API_BASE}/login`, credentials);
    },

    /**
     * Obtiene el perfil del usuario actual
     * @returns {Promise} - Promesa con la respuesta
     */
    getProfile: () => {
        return apiClient.get(`${API_USERS}/profile`);
    },

    /**
     * Actualiza el perfil del usuario
     * @param {Object} profileData - Datos actualizados del perfil
     * @returns {Promise} - Promesa con la respuesta
     */
    updateProfile: (profileData) => {
        return apiClient.put(`${API_USERS}/profile`, profileData);
    }
}; 
import apiClient from './client';
import * as SecureStore from 'expo-secure-store';

// API Endpoints
const API_BASE = '/auth';
const API_USERS = '/users';

// Objeto para almacenar datos de usuario en caché local
let cachedUserData = null;

/**
 * Servicio para gestionar usuarios y autenticación
 */
export const userService = {
    /**
     * Registra un nuevo usuario
     * @param {Object} userData - Datos del usuario para registro
     * @returns {Promise} - Promesa con la respuesta
     */
    register: async (userData) => {
        try {
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
            const response = await apiClient.post(`${API_BASE}/register`, formattedData);

            // Almacenar en caché local
            if (response.data) {
                cachedUserData = response.data;
                await SecureStore.setItemAsync('user_data', JSON.stringify(response.data));
            }

            return response;
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            throw error;
        }
    },

    /**
     * Inicia sesión de usuario
     * @param {Object} credentials - Credenciales (email, password)
     * @returns {Promise} - Promesa con la respuesta que incluye el token
     */
    login: async (credentials) => {
        try {
            const response = await apiClient.post(`${API_BASE}/login`, credentials);

            // Almacenar en caché local
            if (response.data && response.data.user) {
                cachedUserData = response.data.user;
                await SecureStore.setItemAsync('user_data', JSON.stringify(response.data.user));
            }

            return response;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
    },

    /**
     * Obtiene el perfil del usuario actual
     * @returns {Promise} - Promesa con la respuesta
     */
    getProfile: async () => {
        try {
            // Intentar obtener desde el servidor
            const response = await apiClient.get(`${API_USERS}/profile`);

            // Actualizar caché si se obtiene respuesta
            if (response.data) {
                cachedUserData = response.data;
                await SecureStore.setItemAsync('user_data', JSON.stringify(response.data));
            }

            return response;
        } catch (error) {
            console.error('Error al obtener perfil desde API:', error);

            // Si hay datos en caché, usarlos
            if (cachedUserData) {
                console.log('Usando datos de usuario en caché');
                return { data: cachedUserData };
            }

            // Intentar obtener datos del almacenamiento local
            try {
                const storedData = await SecureStore.getItemAsync('user_data');
                if (storedData) {
                    const userData = JSON.parse(storedData);
                    cachedUserData = userData;
                    console.log('Usando datos de usuario del almacenamiento local');
                    return { data: userData };
                }
            } catch (storageError) {
                console.error('Error al obtener datos del almacenamiento local:', storageError);
            }

            // Si no hay datos en caché ni en almacenamiento, crear un usuario simulado
            const mockUser = {
                name: "Usuario AgroDigital",
                email: "usuario@agrodigital.com",
                userId: "user123",
                phone: "No especificado",
                address: "No especificado",
                birthState: "No especificado",
                birthDate: "",
                gender: "",
                status: "ACTIVE"
            };

            console.log('Usando datos de usuario simulados');
            return { data: mockUser };
        }
    },

    /**
     * Actualiza el perfil del usuario
     * @param {Object} profileData - Datos actualizados del perfil
     * @returns {Promise} - Promesa con la respuesta
     */
    updateProfile: async (profileData) => {
        try {
            const response = await apiClient.put(`${API_USERS}/profile`, profileData);

            // Actualizar caché si se obtiene respuesta
            if (response.data) {
                cachedUserData = response.data;
                await SecureStore.setItemAsync('user_data', JSON.stringify(response.data));
            }

            return response;
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            throw error;
        }
    },

    /**
     * Cierra la sesión del usuario
     */
    logout: async () => {
        try {
            // Limpiar datos de caché y almacenamiento
            cachedUserData = null;
            await SecureStore.deleteItemAsync('user_data');
            await SecureStore.deleteItemAsync('auth_token');

            // Aquí podrías realizar una llamada al backend si es necesario
            return { success: true };
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            throw error;
        }
    }
}; 